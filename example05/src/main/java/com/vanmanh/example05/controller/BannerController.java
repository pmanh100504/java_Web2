package com.vanmanh.example05.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.vanmanh.example05.entity.Banner;
import com.vanmanh.example05.payloads.BannerDTO;
import com.vanmanh.example05.service.BannerService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @PostMapping("/admin/banners")
    public ResponseEntity<BannerDTO> createBanner(@Valid @RequestBody Banner banner) {
        BannerDTO savedBanner = bannerService.createBanner(banner);
        return new ResponseEntity<>(savedBanner, HttpStatus.CREATED);
    }

    @GetMapping("/public/banners")
    public ResponseEntity<List<BannerDTO>> getAllBanners() {
        List<BannerDTO> banners = bannerService.getAllBanners();
        return new ResponseEntity<>(banners, HttpStatus.OK);
    }

    @GetMapping("/public/banners/{bannerId}")
    public ResponseEntity<BannerDTO> getBannerById(@PathVariable Long bannerId) {
        BannerDTO bannerDTO = bannerService.getBannerById(bannerId);
        return new ResponseEntity<>(bannerDTO, HttpStatus.OK);
    }

    @GetMapping({"/public/banners/image/{fileName}", "/admin/banners/image/{fileName}"})
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = bannerService.getBannerImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);
        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    @PutMapping("/admin/banners/{bannerId}")
    public ResponseEntity<BannerDTO> updateBanner(@RequestBody Banner banner, @PathVariable Long bannerId) {
        BannerDTO updatedBanner = bannerService.updateBanner(bannerId, banner);
        return new ResponseEntity<>(updatedBanner, HttpStatus.OK);
    }

    @PutMapping("/admin/banners/{bannerId}/image")
    public ResponseEntity<BannerDTO> updateBannerImage(@PathVariable Long bannerId,
            @RequestParam("image") MultipartFile image) throws IOException {
        BannerDTO updatedBanner = bannerService.updateBannerImage(bannerId, image);
        return new ResponseEntity<>(updatedBanner, HttpStatus.OK);
    }

    @DeleteMapping("/admin/banners/{bannerId}")
    public ResponseEntity<String> deleteBanner(@PathVariable Long bannerId) {
        String status = bannerService.deleteBanner(bannerId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
