package com.vanmanh.example05;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.vanmanh.example05.config.AppConstants;
import com.vanmanh.example05.entity.Role;
import com.vanmanh.example05.entity.User;
import com.vanmanh.example05.entity.Cart;
import com.vanmanh.example05.entity.Banner;
import com.vanmanh.example05.repository.RoleRepo;
import com.vanmanh.example05.repository.UserRepo;
import com.vanmanh.example05.repository.CartRepo;
import com.vanmanh.example05.repository.CategoryRepo;
import com.vanmanh.example05.repository.ProductRepo;
import com.vanmanh.example05.repository.BannerRepo;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SpringBootApplication
@SecurityScheme(name = "E-Commerce Application", scheme = "bearer", type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER)
public class Example05Application implements CommandLineRunner{

	@Autowired
    private RoleRepo roleRepo;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private CartRepo cartRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private BannerRepo bannerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(Example05Application.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            Role adminRole = new Role();
            adminRole.setRoleId(AppConstants.ADMIN_ID);
            adminRole.setRoleName("ADMIN");
            
            Role userRole = new Role();
            userRole.setRoleId(AppConstants.USER_ID);
            userRole.setRoleName("USER");
            
            List<Role> roles = List.of(adminRole, userRole);
            List<Role> savedRoles = roleRepo.saveAll(roles);
            savedRoles.forEach(System.out::println);

            // Seed default admin user if not exists
            if (!userRepo.findByEmail("pmanh1005@gmail.com").isPresent()) {
                System.out.println("=== Seeding default admin user ===");
                User adminUser = new User();
                adminUser.setFirstName("Manh");
                adminUser.setLastName("Van");
                adminUser.setMobileNumber("0912345678");
                adminUser.setEmail("pmanh1005@gmail.com");
                adminUser.setPassword(passwordEncoder.encode("1"));
                
                Role adminRoleObj = roleRepo.findById(AppConstants.ADMIN_ID).get();
                Role userRoleObj = roleRepo.findById(AppConstants.USER_ID).get();
                adminUser.setRoles(new java.util.HashSet<>(List.of(adminRoleObj, userRoleObj)));

                Cart cart = new Cart();
                cart.setUser(adminUser);
                adminUser.setCart(cart);

                userRepo.save(adminUser);
                System.out.println("=== Seeding default admin user completed ===");
            }

            System.out.println("=== Resetting product stock levels ===");
            productRepo.findAll().forEach(p -> {
                if (p.getQuantity() == null || p.getQuantity() < 10) {
                    p.setQuantity(100);
                    productRepo.save(p);
                }
            });

            System.out.println("=== MySQL DB users ===");
            userRepo.findAll().forEach(u -> System.out.println("DB_USER: " + u.getEmail() + " (ID: " + u.getUserId() + ")"));
            System.out.println("=== MySQL DB carts ===");
            cartRepo.findAll().forEach(c -> System.out.println("DB_CART: ID=" + c.getCartId() + " USER=" + (c.getUser() != null ? c.getUser().getEmail() : "null")));

            System.out.println("=== Seeding default banners ===");
            if (bannerRepo.count() == 0) {
                Banner mainBanner = new Banner();
                mainBanner.setTitle("DỊCH VỤ CHÉP GAME VIỆT HÓA PS4, PS5");
                mainBanner.setSubtitle("BẢN VIỆT HÓA: 50.000đ - CÁC BẢN CÒN LẠI: 30.000đ");
                mainBanner.setType("MAIN");
                mainBanner.setBackground("linear-gradient(135deg, #09152b 0%, #1e3a8a 100%)");
                mainBanner.setInfo("601 Nguyễn Đình Chiểu, P.2, Q.3, TP. Hồ Chí Minh | Hotline: 0988.443.789");
                mainBanner.setImage("default.png");
                mainBanner.setLink("#");

                Banner topBanner = new Banner();
                topBanner.setTitle("GIAO NHANH CHỈ");
                topBanner.setSubtitle("2 GIỜ TẠI HCM");
                topBanner.setType("SUB_TOP");
                topBanner.setBackground("linear-gradient(135deg, #1d60b3 0%, #2563eb 100%)");
                topBanner.setImage("default.png");
                topBanner.setLink("#");

                Banner bottomBanner = new Banner();
                bottomBanner.setTitle("SHOP YÊU THÍCH");
                bottomBanner.setSubtitle("Gian hàng Shopee Mall");
                bottomBanner.setType("SUB_BOTTOM");
                bottomBanner.setBackground("linear-gradient(135deg, #ea580c 0%, #f97316 100%)");
                bottomBanner.setImage("default.png");
                bottomBanner.setLink("#");

                bannerRepo.saveAll(List.of(mainBanner, topBanner, bottomBanner));
                System.out.println("=== Default banners seeded successfully ===");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
