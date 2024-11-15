package com.linkpulse.Link_Pulse_API.Link_Pulse_Private.Accenture.Helper;

import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

public class MediaTypeResolver {

    private static final Map<String, MediaType> MEDIA_TYPE_MAP = new HashMap<>();

    static {
        MEDIA_TYPE_MAP.put("png", MediaType.IMAGE_PNG);
        MEDIA_TYPE_MAP.put("jpg", MediaType.IMAGE_JPEG);
        MEDIA_TYPE_MAP.put("jpeg", MediaType.IMAGE_JPEG);
        MEDIA_TYPE_MAP.put("gif", MediaType.IMAGE_GIF);
        MEDIA_TYPE_MAP.put("bmp", MediaType.valueOf("image/bmp")); // Define BMP manually
        MEDIA_TYPE_MAP.put("webp", MediaType.valueOf("image/webp")); // Define WebP manually
        MEDIA_TYPE_MAP.put("svg", MediaType.valueOf("image/svg+xml")); //
        MEDIA_TYPE_MAP.put("pdf", MediaType.APPLICATION_PDF);
        MEDIA_TYPE_MAP.put("txt", MediaType.TEXT_PLAIN);
        MEDIA_TYPE_MAP.put("html", MediaType.TEXT_HTML);
        MEDIA_TYPE_MAP.put("mp4", MediaType.APPLICATION_OCTET_STREAM); // for video files
        MEDIA_TYPE_MAP.put("mp3", MediaType.APPLICATION_OCTET_STREAM); // for audio files
        // Add more mappings as needed
    }

    public static MediaType resolveMediaType(String fileName) {
        String extension = getFileExtension(fileName);
        return MEDIA_TYPE_MAP.getOrDefault(extension.toLowerCase(), MediaType.APPLICATION_OCTET_STREAM); // Fallback to octet-stream
    }

    private static String getFileExtension(String fileName) {
        if (fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf('.') + 1);
        }
        return ""; // Return empty string if there's no extension
    }
}
