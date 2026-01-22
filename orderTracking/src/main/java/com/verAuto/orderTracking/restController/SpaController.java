package com.verAuto.orderTracking.restController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // 1. Matches first-level routes (e.g., /login, /orders)
    @GetMapping("/{path:[^\\.]*}")
    public String redirectRoot() {
        return "forward:/index.html";
    }

    // 2. Matches nested routes (e.g., /orders/details, /settings/profile)
    @GetMapping("/**/{path:[^\\.]*}")
    public String redirectNested() {
        return "forward:/index.html";
    }
}
