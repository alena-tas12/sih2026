fastlane for iOS builds

Usage:
- Provide App Store Connect API key via repository secrets:
  - APP_STORE_CONNECT_KEY_BASE64: base64 of the AuthKey_XXXX.p8 file
  - APP_STORE_CONNECT_KEY_ID
  - APP_STORE_CONNECT_ISSUER_ID
- The workflow .github/workflows/ios-build.yml will decode the key and run `fastlane ios build`.
- For automatic code signing, configure match or provide certificates and provisioning profiles.
