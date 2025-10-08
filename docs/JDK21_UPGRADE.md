Upgrade to Java 21 (LTS) — macOS (zsh)

This document explains how to upgrade the Android subproject to use Java 21.

Summary
- Install JDK 21 (Adoptium/Temurin) on macOS.
- Configure your shell (zsh) to use JDK 21 via JAVA_HOME.
- Optionally set `org.gradle.java.home` in `android/gradle.properties` for a machine-specific override.
- Confirm Gradle and Android Gradle Plugin are compatible and run a build.

1) Install JDK 21 (recommended: Temurin via Homebrew)

If you use Homebrew (recommended):

```zsh
brew install temurin --cask
# or to install Temurin 21 specifically, if available:
brew install --cask temurin
# After installation, list installed jdks
/usr/libexec/java_home -V
```

If Homebrew cask for temurin is not available on your machine, download from Adoptium:
- https://adoptium.net/temurin/releases/?version=21

2) Point your shell to JDK 21 (zsh)

Add to your `~/.zshrc` (or run in current shell):

```zsh
# set JAVA_HOME to JDK 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
# verify
java -version
javac -version
```

3) Optional: Set Gradle to use a specific Java installation (machine-local)

Open `android/gradle.properties` and either:
- Uncomment and set `org.gradle.java.home` to your JDK 21 path, or
- Keep it commented and rely on `JAVA_HOME` in your shell.

Example:

```properties
org.gradle.java.home=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

Notes:
- Avoid committing an absolute `org.gradle.java.home` unless you want to lock the path for a CI runner or specific developer machine.

4) Verify Gradle/AGP compatibility

This repo uses Gradle wrapper `gradle-8.11.1` and Android Gradle Plugin `8.7.2` (see
`android/gradle/wrapper/gradle-wrapper.properties` and `android/build.gradle`).
Gradle 8.11 and AGP 8.7+ are compatible with Java 21 for compilation, but some
plugins or annotation processors may need updates. If you see compilation
errors, check plugin dependency versions first.

5) Run a clean build (from repo root)

```zsh
# ensure JAVA_HOME is set to 21 in this shell session
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
# run the gradle wrapper for the Android project
cd android
./gradlew clean assembleDebug --no-daemon
```

If the build completes, the project compiles with Java 21.

6) If you need to update Gradle wrapper

If you must update Gradle to a newer patch, change the `distributionUrl` in
`android/gradle/wrapper/gradle-wrapper.properties` to a newer 8.x release and
run:

```zsh
cd android
./gradlew wrapper --gradle-version 8.11.1
```

(8.11.1 is currently used in this repo; adjust if necessary.)

7) CI and Docker

- Update your CI environment image to include JDK 21 (e.g., adoptopenjdk:21 or
  ubuntu image with temurin-21).
- Ensure `./gradlew` runs with JDK 21 on CI (set JAVA_HOME in the job).

8) Troubleshooting

- If Gradle fails with an UnsupportedClassVersionError, confirm `java -version` is 21 and `org.gradle.java.home` (if set) points to JDK 21.
- If annotation processors or libraries fail, inspect stack traces and upgrade those dependencies.

If you'd like, I can:
- Create a small script to toggle JAVA_HOME for local developers,
- Update CI config to use JDK 21,
- Attempt a local Gradle build and report errors.

*** End of document ***
