package com.verAuto.orderTracking.restController;

import com.verAuto.orderTracking.DTO.WindowDetailsDTO;
import com.verAuto.orderTracking.service.WindowDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/window-details")
public class WindowDetailsController {

    private final WindowDetailsService windowDetailsService;

    @Autowired
    public WindowDetailsController(WindowDetailsService windowDetailsService) {
        this.windowDetailsService = windowDetailsService;
    }

    @GetMapping
    public ResponseEntity<List<WindowDetailsDTO>> getAllWindowDetails() {

        return new ResponseEntity<>(windowDetailsService.getAllWinodwDetails(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<List<WindowDetailsDTO>> addNewWindowDetails(@RequestBody List<WindowDetailsDTO> windowDetailsDTOS) {

        return new ResponseEntity<>(windowDetailsService.saveWindowsDetails(windowDetailsDTOS), HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteInSelectedWindowDetails(@RequestParam Long orderId,
                                                                @RequestParam Long selectedWindowDetails) {

        WindowDetailsDTO request = new WindowDetailsDTO();
        request.setId(selectedWindowDetails);
        request.setOrderId(orderId);
        windowDetailsService.deleteWindowDetails(request);

        return  new ResponseEntity<>("the inselected offers has been deleted", HttpStatus.NO_CONTENT);
    }

}
