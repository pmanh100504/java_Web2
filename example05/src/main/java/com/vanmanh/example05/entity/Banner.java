package com.vanmanh.example05.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "banners")
@NoArgsConstructor
@AllArgsConstructor
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bannerId;

    private String title;
    private String subtitle;
    private String image;
    private String link;
    private String type; // e.g. MAIN, SUB_TOP, SUB_BOTTOM
    private String background; // Hex or gradient CSS
    private String info; // address or phone or extra text
}
