package com.vanmanh.example05.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vanmanh.example05.payloads.CartDTO;
import com.vanmanh.example05.service.CartService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long cartId, @PathVariable Long productId,
            @PathVariable Integer quantity) {
        CartDTO cartDTO = cartService.addProductToCart(cartId, productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
    }

    @GetMapping("/admin/carts")
    public ResponseEntity<List<CartDTO>> getCarts() {
        List<CartDTO> cartDTOs = cartService.getAllCarts();
        return new ResponseEntity<List<CartDTO>>(cartDTOs, HttpStatus.OK);
    }

    @GetMapping("/public/user/{emailId}/carts/{cartId}")
    public ResponseEntity<CartDTO> getCartById(@PathVariable String emailId, @PathVariable Long cartId) {
        CartDTO cartDTO = cartService.getCart(emailId, cartId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    @GetMapping("/public/carts/{cartId}")
    public ResponseEntity<CartDTO> getCartByIdQuery(@PathVariable Long cartId, @org.springframework.web.bind.annotation.RequestParam String email) {
        CartDTO cartDTO = cartService.getCart(email, cartId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    @PutMapping("/public/carts/{cartId}/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> updateCartProduct(@PathVariable Long cartId, @PathVariable Long productId,
            @PathVariable Integer quantity) {
        CartDTO cartDTO = cartService.updateProductQuantityInCart(cartId, productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    @DeleteMapping("/public/carts/{cartId}/product/{productId}")
    public ResponseEntity<String> deleteProductFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
        String status = cartService.deleteProductFromCart(cartId, productId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }

    @DeleteMapping("/public/carts/{cartId}")
    public ResponseEntity<String> deleteCart(@PathVariable Long cartId, @org.springframework.web.bind.annotation.RequestParam String email) {
        String status = cartService.deleteCartByEmail(email, cartId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }

    @GetMapping("/admin/carts/{cartId}")
    public ResponseEntity<CartDTO> getCartByIdAdmin(@PathVariable Long cartId) {
        CartDTO cartDTO = cartService.getCartById(cartId);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);
    }

    @DeleteMapping("/admin/carts/{cartId}")
    public ResponseEntity<String> deleteCartAdmin(@PathVariable Long cartId) {
        String status = cartService.deleteCartById(cartId);
        return new ResponseEntity<String>(status, HttpStatus.OK);
    }
}