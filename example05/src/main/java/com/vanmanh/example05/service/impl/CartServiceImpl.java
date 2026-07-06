package com.vanmanh.example05.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vanmanh.example05.entity.Cart;
import com.vanmanh.example05.entity.CartItem;
import com.vanmanh.example05.entity.Product;
import com.vanmanh.example05.exceptions.APIException;
import com.vanmanh.example05.exceptions.ResourceNotFoundException;
import com.vanmanh.example05.payloads.CartDTO;
import com.vanmanh.example05.payloads.ProductDTO;
import com.vanmanh.example05.repository.CartItemRepo;
import com.vanmanh.example05.repository.CartRepo;
import com.vanmanh.example05.repository.ProductRepo;
import com.vanmanh.example05.service.CartService;

import jakarta.transaction.Transactional;

@Transactional
@Service

public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private CartItemRepo cartItemRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CartDTO addProductToCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem != null) {
            return updateProductQuantityInCart(cartId, productId, cartItem.getQuantity() + quantity);
        }
        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available");

        }
        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity" + product.getQuantity() + ".");

        }
        CartItem newCartItem = new CartItem();
        newCartItem.setCart(cart);
        newCartItem.setProduct(product);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());
        cart.getCartItems().add(newCartItem);
        cartItemRepo.save(newCartItem);
        product.setQuantity(product.getQuantity() - quantity);
        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        List<ProductDTO> productDTOs = cart.getCartItems().stream()
                .map(p -> {
                    ProductDTO dto = modelMapper.map(p.getProduct(), ProductDTO.class);
                    dto.setQuantity(p.getQuantity());
                    return dto;
                }).collect(Collectors.toList());

        cartDTO.setProducts(productDTOs);
        return cartDTO;

    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepo.findAll();

        // if (carts.size() == 0) {
        //     throw new APIException("No carts exists");
        // }

        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> {
                        ProductDTO dto = modelMapper.map(p.getProduct(), ProductDTO.class);
                        dto.setQuantity(p.getQuantity());
                        return dto;
                    }).collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).collect(Collectors.toList());
        return cartDTOs;

    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(p -> {
                    ProductDTO dto = modelMapper.map(p.getProduct(), ProductDTO.class);
                    dto.setQuantity(p.getQuantity());
                    return dto;
                }).collect(Collectors.toList());
        cartDTO.setProducts(products);
        return cartDTO;
    }

    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("product", "productId", productId));
        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem != null) {
            throw new APIException("Product " + product.getProductName() + " not availble in the cart");
        }
        Double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
        cartItem.setProductPrice(product.getSpecialPrice());
        cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * cartItem.getQuantity()));
        cartItem = cartItemRepo.save(cartItem);
    }

    @Override
    public CartDTO updateProductQuantityInCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("product", "productId", productId));

        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!");
        }

        int quantityDiff = quantity - cartItem.getQuantity();
        if (quantityDiff > 0) {
            if (product.getQuantity() == 0) {
                throw new APIException(product.getProductName() + " is not available");
            }
            if (product.getQuantity() < quantityDiff) {
                throw new APIException("Please, make an order of the " + product.getProductName()
                        + " less than or equal to the quantity " + product.getQuantity() + ".");
            }
        }
        Double cartPrice = cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity());
        product.setQuantity(product.getQuantity() + cartItem.getQuantity() - quantity);
        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setQuantity(quantity);
        cartItem.setDiscount(product.getDiscount());
        cart.setTotalPrice(cartPrice + (cartItem.getProductPrice() * quantity));
        cartItem = cartItemRepo.save(cartItem);
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> productDTOs = cart.getCartItems().stream()
                .map(p -> {
                    ProductDTO dto = modelMapper.map(p.getProduct(), ProductDTO.class);
                    dto.setQuantity(p.getQuantity());
                    return dto;
                }).collect(Collectors.toList());
        cartDTO.setProducts(productDTOs);
        return cartDTO;

    }

    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        CartItem cartItem = cartItemRepo.findCartItemByProductIdAndCartId(cartId, productId);
        
        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }
        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));
        Product product = cartItem.getProduct();

        product.setQuantity(product.getQuantity() + cartItem.getQuantity());
        cart.getCartItems().remove(cartItem);
        cartItemRepo.deleteCartItemByProductIdAndCartId(cartId, productId);

        return "Product " + cartItem.getProduct().getProductName() + " removed from the cart!!!";
    }

    @Override
    public String deleteCartByEmail(String emailId, Long cartId) {
        Cart cart = cartRepo.findCartByEmailAndCartId(emailId, cartId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }

        // restore product quantities
        if (cart.getCartItems() != null) {
            for (CartItem ci : cart.getCartItems()) {
                Product p = ci.getProduct();
                if (p != null) {
                    p.setQuantity(p.getQuantity() + (ci.getQuantity() == null ? 0 : ci.getQuantity()));
                    productRepo.save(p);
                }
                ci.setCart(null);
                ci.setProduct(null);
                cartItemRepo.delete(ci);
            }
            cart.getCartItems().clear();
        }

        com.vanmanh.example05.entity.User user = cart.getUser();
        if (user != null) {
            user.setCart(null);
        }
        cart.setUser(null);

        cartRepo.delete(cart);
        return "Cart " + cartId + " removed";
    }

    @Override
    public CartDTO getCartById(Long cartId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO> products = cart.getCartItems().stream()
                .map(p -> {
                    ProductDTO dto = modelMapper.map(p.getProduct(), ProductDTO.class);
                    dto.setQuantity(p.getQuantity());
                    return dto;
                }).collect(Collectors.toList());
        cartDTO.setProducts(products);
        return cartDTO;
    }

    @Override
    public String deleteCartById(Long cartId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        if (cart.getCartItems() != null) {
            for (CartItem ci : cart.getCartItems()) {
                Product p = ci.getProduct();
                if (p != null) {
                    p.setQuantity(p.getQuantity() + (ci.getQuantity() == null ? 0 : ci.getQuantity()));
                    productRepo.save(p);
                }
                ci.setCart(null);
                ci.setProduct(null);
                cartItemRepo.delete(ci);
            }
            cart.getCartItems().clear();
        }

        com.vanmanh.example05.entity.User user = cart.getUser();
        if (user != null) {
            user.setCart(null);
        }
        cart.setUser(null);

        cartRepo.delete(cart);
        return "Cart " + cartId + " removed";
    }
}