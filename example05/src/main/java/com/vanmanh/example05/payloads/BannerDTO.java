package com.vanmanh.example05.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDTO {
    private Long bannerId;
    private String title;
    private String subtitle;
    private String image;
    private String link;
    private String type;
    private String background;
    private String info;
}
