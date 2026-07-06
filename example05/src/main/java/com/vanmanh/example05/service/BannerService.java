package com.vanmanh.example05.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.vanmanh.example05.entity.Banner;
import com.vanmanh.example05.payloads.BannerDTO;

public interface BannerService {
    BannerDTO createBanner(Banner banner);
    List<BannerDTO> getAllBanners();
    BannerDTO getBannerById(Long bannerId);
    BannerDTO updateBanner(Long bannerId, Banner banner);
    BannerDTO updateBannerImage(Long bannerId, MultipartFile image) throws IOException;
    InputStream getBannerImage(String fileName) throws FileNotFoundException;
    String deleteBanner(Long bannerId);
}
