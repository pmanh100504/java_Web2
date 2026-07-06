package com.vanmanh.example05.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vanmanh.example05.entity.Banner;

@Repository
public interface BannerRepo extends JpaRepository<Banner, Long> {
}
