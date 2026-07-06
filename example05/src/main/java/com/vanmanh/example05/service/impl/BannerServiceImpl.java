package com.vanmanh.example05.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vanmanh.example05.entity.Banner;
import com.vanmanh.example05.exceptions.APIException;
import com.vanmanh.example05.exceptions.ResourceNotFoundException;
import com.vanmanh.example05.payloads.BannerDTO;
import com.vanmanh.example05.repository.BannerRepo;
import com.vanmanh.example05.service.BannerService;
import com.vanmanh.example05.service.FileService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerRepo bannerRepo;

    @Autowired
    private FileService fileService;

    @Autowired
    private ModelMapper modelMapper;

    @Value("${project.image}")
    private String path;

    @Override
    public BannerDTO createBanner(Banner banner) {
        if (banner.getImage() == null || banner.getImage().isEmpty()) {
            banner.setImage("default.png");
        }
        Banner savedBanner = bannerRepo.save(banner);
        return modelMapper.map(savedBanner, BannerDTO.class);
    }

    @Override
    public List<BannerDTO> getAllBanners() {
        List<Banner> banners = bannerRepo.findAll();
        return banners.stream()
                .map(banner -> modelMapper.map(banner, BannerDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public BannerDTO getBannerById(Long bannerId) {
        Banner banner = bannerRepo.findById(bannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "bannerId", bannerId));
        return modelMapper.map(banner, BannerDTO.class);
    }

    @Override
    public BannerDTO updateBanner(Long bannerId, Banner banner) {
        Banner bannerFromDB = bannerRepo.findById(bannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "bannerId", bannerId));

        banner.setBannerId(bannerId);
        if (banner.getImage() == null || banner.getImage().isEmpty()) {
            banner.setImage(bannerFromDB.getImage());
        }

        Banner savedBanner = bannerRepo.save(banner);
        return modelMapper.map(savedBanner, BannerDTO.class);
    }

    @Override
    public BannerDTO updateBannerImage(Long bannerId, MultipartFile image) throws IOException {
        Banner bannerFromDB = bannerRepo.findById(bannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "bannerId", bannerId));

        String fileName = fileService.uploadImage(path, image);
        bannerFromDB.setImage(fileName);

        Banner updatedBanner = bannerRepo.save(bannerFromDB);
        return modelMapper.map(updatedBanner, BannerDTO.class);
    }

    @Override
    public InputStream getBannerImage(String fileName) throws FileNotFoundException {
        return fileService.getResource(path, fileName);
    }

    @Override
    public String deleteBanner(Long bannerId) {
        Banner banner = bannerRepo.findById(bannerId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner", "bannerId", bannerId));
        bannerRepo.delete(banner);
        return "Banner with bannerId: " + bannerId + " deleted successfully!";
    }
}
