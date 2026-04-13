package com.enterprise.website.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import javax.imageio.ImageIO;

/**
 * 验证码服务（内存存储）
 */
@Service
public class CaptchaService {

    private final ConcurrentHashMap<String, CaptchaEntry> captchaStore = new ConcurrentHashMap<>();

    @Value("${captcha.expire-seconds}")
    private int expireSeconds;

    @Value("${captcha.width}")
    private int width;

    @Value("${captcha.height}")
    private int height;

    private record CaptchaEntry(String code, long expireAt) {}

    /**
     * 生成验证码
     *
     * @return captchaKey 和 Base64 编码的图片
     */
    public CaptchaResult generate() {
        String code = generateCode(4);
        String captchaKey = UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        captchaStore.put(captchaKey, new CaptchaEntry(code, System.currentTimeMillis() + expireSeconds * 1000L));

        // 生成图片
        String base64Image = renderImage(code);

        return new CaptchaResult(captchaKey, base64Image);
    }

    /**
     * 验证验证码
     */
    public boolean validate(String captchaKey, String userInput) {
        if (captchaKey == null || userInput == null) return false;

        CaptchaEntry entry = captchaStore.remove(captchaKey);
        if (entry == null) return false;
        if (System.currentTimeMillis() > entry.expireAt()) return false;

        return entry.code().equalsIgnoreCase(userInput.trim());
    }

    /**
     * 生成随机验证码文本
     */
    private String generateCode(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";  // 去掉容易混淆的 I/O/0/1
        StringBuilder sb = new StringBuilder();
        java.util.Random rnd = new java.util.Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * 渲染验证码图片，返回 Base64
     */
    private String renderImage(String code) {
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();

        // 背景
        g.setColor(new Color(240, 240, 250));
        g.fillRect(0, 0, width, height);

        // 干扰线
        java.util.Random rnd = new java.util.Random();
        for (int i = 0; i < 5; i++) {
            g.setColor(new Color(rnd.nextInt(200), rnd.nextInt(200), rnd.nextInt(200)));
            g.drawLine(rnd.nextInt(width), rnd.nextInt(height), rnd.nextInt(width), rnd.nextInt(height));
        }

        // 干扰点
        for (int i = 0; i < 30; i++) {
            g.setColor(new Color(rnd.nextInt(255), rnd.nextInt(255), rnd.nextInt(255)));
            g.fillOval(rnd.nextInt(width), rnd.nextInt(height), 2, 2);
        }

        // 绘制文字
        g.setFont(new Font("Arial", Font.BOLD, 28));
        for (int i = 0; i < code.length(); i++) {
            g.setColor(new Color(rnd.nextInt(100), rnd.nextInt(100), rnd.nextInt(100)));
            g.drawString(String.valueOf(code.charAt(i)), 10 + i * 26, 30);
        }

        g.dispose();

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("验证码生成失败", e);
        }
    }

    /**
     * 清理过期验证码（定时任务可调用）
     */
    public void cleanExpired() {
        long now = System.currentTimeMillis();
        captchaStore.entrySet().removeIf(e -> e.getValue().expireAt() < now);
    }

    public record CaptchaResult(String captchaKey, String imageBase64) {}
}
