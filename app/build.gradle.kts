plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

apply {
    from(file("${rootDir}/gradle/artifact-settings.gradle"))
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

kotlin {
    jvmToolchain(17)
}

android {
    namespace = "org.maplibre.navigation.android.example"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        applicationId = "org.maplibre.navigation.android.example"
        compileSdk = 34
        minSdk = 21
        targetSdk = 35

        versionCode = 1
        versionName = project.properties.get("versionName") as String? ?: "0.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        multiDexEnabled = true
    }

    buildTypes {
        debug {
            enableUnitTestCoverage = false
        }

        release {
            isMinifyEnabled = true
        }
    }

    buildFeatures {
        buildConfig = true
    }

    dexOptions {
        maxProcessCount = 8
        javaMaxHeapSize = "2g"
        preDexLibraries = true
    }

    packaging {
        jniLibs.pickFirsts.addAll(
            listOf(
                "**/armeabi-v7a/libmapbox-gl.so",
                "**/x86/libmapbox-gl.so",
                "**/arm64-v8a/libmapbox-gl.so",
                "**/x86_64/libmapbox-gl.so",
                "**/x86/libmapbox-gl.so"
            )
        )
    }

    buildFeatures {
        viewBinding = true
    }

    lint {
        abortOnError = false
    }
}

dependencies {
    implementation(files("libs/localserver-release.aar"))
    implementation(project(":local-data"))
    implementation(project(":libandroid-navigation-ui"))

    implementation(libs.maplibre) {
        // Exclude old version of GeoJSON libs
        // At the moment a newer version - that supports Kotlin Multiplatform - is required to run navigation
        exclude(group = "org.maplibre.gl", module = "android-sdk-geojson")
        exclude(group = "org.maplibre.gl", module = "android-sdk-turf")
    }

    // Support libraries
    implementation(libs.material)
    implementation(libs.androidx.recyclerview)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.cardview)
    implementation(libs.androidx.cardview)

    implementation(libs.play.services.location)

    // Logging
    implementation(libs.timber)

    // Leak Canary
    implementation(libs.leakcanary)

    implementation(libs.androidx.lifecycle.viewmodel)
    implementation(libs.androidx.multidex)
}

apply {
    from(file("${rootDir}/gradle/developer-config.gradle"))
}
