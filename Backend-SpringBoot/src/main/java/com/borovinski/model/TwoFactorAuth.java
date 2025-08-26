package com.borovinski.model;

import com.borovinski.domain.VerificationType;
import lombok.Data;
import lombok.Setter;

@Data
public class TwoFactorAuth {

    @Setter
    private boolean enabled = false;
    private VerificationType sendTo;

    //рефакторинг этого геттера (ломбок не позволил через аннотацию)
    public boolean isEnabled() {
        return enabled;
    }

}
