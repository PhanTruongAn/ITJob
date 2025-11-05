package vn.phantruongan.backend.util.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;

@Target({ ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckPermission {
    ResourceEnum resource();

    ActionEnum action();
}