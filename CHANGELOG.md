## [0.0.141](https://github.com/wessberg/polyfiller/compare/v0.0.140-rerelease...v0.0.141) (2021-05-20)

### Bug Fixes

- cleanup invalid cache entries if they're not decodable ([a2d3376](https://github.com/wessberg/polyfiller/commit/a2d337693f2577eaf3e0ff9841bcea9e1429af61))

## [0.0.140-rerelease](https://github.com/wessberg/polyfiller/compare/v0.0.140...v0.0.140-rerelease) (2021-05-20)

### Bug Fixes

- more descriptive error names ([292d9f5](https://github.com/wessberg/polyfiller/commit/292d9f540a61967399221e42e0c6be47682d8fe3))

## [0.0.140](https://github.com/wessberg/polyfiller/compare/v0.0.139-rerelease...v0.0.140) (2021-05-20)

### Bug Fixes

- fix problems where bad URLs such as // could cause crashes ([b20d9e9](https://github.com/wessberg/polyfiller/commit/b20d9e9ba06eba9576f21adb9d140543cacabcac))

## [0.0.139-rerelease](https://github.com/wessberg/polyfiller/compare/v0.0.139...v0.0.139-rerelease) (2021-05-20)

## [0.0.139](https://github.com/wessberg/polyfiller/compare/v0.0.138...v0.0.139) (2021-05-20)

### Features

- **api:** generate better version names in the API config ([38907eb](https://github.com/wessberg/polyfiller/commit/38907eb284f85af12aaef0013fa8adae9a718b33))

## [0.0.138](https://github.com/wessberg/polyfiller/compare/v0.0.137...v0.0.138) (2021-05-19)

## [0.0.137](https://github.com/wessberg/polyfiller/compare/v0.0.136...v0.0.137) (2021-05-19)

### Bug Fixes

- **polyfill:** fix feature detection for Constructable Stylesheets ([7f5b1ec](https://github.com/wessberg/polyfiller/commit/7f5b1ecc5568784ec6cbf47b2ab8ceb3f770295c))

### Features

- **ua:** add handling or Sogou Explorer, Chromium on Smart TVs, Dalvik VMs, and others ([134030d](https://github.com/wessberg/polyfiller/commit/134030d927b01ee3b399e8d19d94866483352549))

## [0.0.136](https://github.com/wessberg/polyfiller/compare/v0.0.135...v0.0.136) (2021-05-19)

### Features

- **ua:** add support for detecting browsers based on Gecko/Firefox like Iceweasel and IceDragon ([a794c4c](https://github.com/wessberg/polyfiller/commit/a794c4ca5ed186261c91965f31a9cc0277d0b361))

## [0.0.135](https://github.com/wessberg/polyfiller/compare/v0.0.134...v0.0.135) (2021-05-19)

### Bug Fixes

- **ua:** add better error handling ([45ef899](https://github.com/wessberg/polyfiller/commit/45ef8992ee49c55387a7eaf460fad0ba961fa0d6))
- **ua:** add support for Google AdsBot ([5600d4d](https://github.com/wessberg/polyfiller/commit/5600d4d0042a8fcfe7c946945fc6e641126934c1))

## [0.0.134](https://github.com/wessberg/polyfiller/compare/v0.0.133...v0.0.134) (2021-05-19)

### Bug Fixes

- **ua:** handle special case with the old stock Android browser ([0ae62a7](https://github.com/wessberg/polyfiller/commit/0ae62a7e43c9f11668cf7b4890e4dd2902840c21))

## [0.0.133](https://github.com/wessberg/polyfiller/compare/v0.0.132-rerelease...v0.0.133) (2021-05-19)

### Bug Fixes

- **ua:** fix detection of Facebook on iOS and Edge Mobile on Android ([91a8de2](https://github.com/wessberg/polyfiller/commit/91a8de2d239527dea10894c466bc81c29037ab18))

## [0.0.132-rerelease](https://github.com/wessberg/polyfiller/compare/v0.0.132...v0.0.132-rerelease) (2021-05-19)

### Bug Fixes

- set NODE_ENV as an environment variable ([6957429](https://github.com/wessberg/polyfiller/commit/69574293e5ad0879bd2118b836686a20e84303c1))

## [0.0.132](https://github.com/wessberg/polyfiller/compare/v0.0.131...v0.0.132) (2021-05-19)

### Bug Fixes

- add environment to sentry configuration ([cd145fc](https://github.com/wessberg/polyfiller/commit/cd145fcd7a0b767d449c0233c1ed306b7fb73a5f))
- track unsupported UA exceptions via Sentry ([e3ce123](https://github.com/wessberg/polyfiller/commit/e3ce1238f09110b3bd168a42e97327312a858d51))

### Features

- **api:** add request logging ([a58e2c5](https://github.com/wessberg/polyfiller/commit/a58e2c530eb4461399798ff98d8a28eac66fe7e0))
- **metrics:** integrate Sentry metrics ([67ede53](https://github.com/wessberg/polyfiller/commit/67ede5312c02f41ef5d29a3c7bf972f7bd2429ef))
- **metrics:** integrate Sentry tracing ([929baa4](https://github.com/wessberg/polyfiller/commit/929baa4a5158eab0a7e9356aa300f9f9531b47e5))

## [0.0.131](https://github.com/wessberg/polyfiller/compare/v0.0.130...v0.0.131) (2021-05-18)

### Bug Fixes

- **polyfill:** temporarily disable sourcemaps via [@swc](https://github.com/swc) as it breaks the service ([706ac97](https://github.com/wessberg/polyfiller/commit/706ac978be5fbde9228c8e4fe8ef6d55336e4330))
- **polyfill:** temporarily disable sourcemaps via [@swc](https://github.com/swc) as it breaks the service ([5c925f1](https://github.com/wessberg/polyfiller/commit/5c925f183ec39a6c70942ed6982bceb84b13b510))
- **polyfill:** temporarily disable sourcemaps via [@swc](https://github.com/swc) as it breaks the service ([fd2fead](https://github.com/wessberg/polyfiller/commit/fd2fead24bc668ce533b65be22c889bce2a2db27))
- **polyfill:** work around issue in @swc/core ([9ba9dc8](https://github.com/wessberg/polyfiller/commit/9ba9dc8d848ec9a813b8ce382654ae9b978d2c72))

## [0.0.130](https://github.com/wessberg/polyfiller/compare/v0.0.129...v0.0.130) (2021-05-18)

### Bug Fixes

- **swc:** make sure regenerator-runtime is always inlined ([c9c6114](https://github.com/wessberg/polyfiller/commit/c9c61147972a0d25ffcf719e548e7ba3d7e56625))
- **swc:** make sure regenerator-runtime is always inlined ([8f0f4d9](https://github.com/wessberg/polyfiller/commit/8f0f4d9e534a9999b4a608fe111641efda685346))
- **ts:** fix type issue ([9b23786](https://github.com/wessberg/polyfiller/commit/9b23786e85ada198ea4280eb514bd9369b9a84c8))
- **ts:** fix type issue ([b938bbd](https://github.com/wessberg/polyfiller/commit/b938bbd44ba54b8c430996fadc90ef4016a0c878))

### Features

- **blob:** update Blob polyfill dependency ([780d06d](https://github.com/wessberg/polyfiller/commit/780d06ddc5b82a994fa7313dc02552022e43a688))
- **ecma-262:** update core-js dependency ([14eb2aa](https://github.com/wessberg/polyfiller/commit/14eb2aaf166444b5c3355f914f5203cd4676ab6a))
- **intl:** bump dependencies for Intl polyfills ([86ab121](https://github.com/wessberg/polyfiller/commit/86ab121ab441bce99b76b6109df0b645c8f9c991))

## [0.0.129](https://github.com/wessberg/polyfiller/compare/v0.0.128...v0.0.129) (2021-05-17)

## [0.0.128](https://github.com/wessberg/polyfiller/compare/v0.0.127...v0.0.128) (2021-05-17)

## [0.0.127](https://github.com/wessberg/polyfiller/compare/v0.0.126...v0.0.127) (2021-05-17)

### Features

- **form-data:** change to more reliable FormData implementation ([63ca455](https://github.com/wessberg/polyfiller/commit/63ca4552ee597044377eb404205be5e09669f1f9))
- **form-data:** change to more reliable FormData implementation ([61f1f49](https://github.com/wessberg/polyfiller/commit/61f1f49a80dc63d3013d092e98284119b824520a))
- **form-data:** change to more reliable FormData implementation ([e413d41](https://github.com/wessberg/polyfiller/commit/e413d41e225f413015da017cf6c26db527b765af))

## [0.0.126](https://github.com/wessberg/polyfiller/compare/v0.0.124...v0.0.126) (2021-04-10)

### Bug Fixes

- **chromium:** add support for Chrome Canary v92 ([1e21f55](https://github.com/wessberg/polyfiller/commit/1e21f55064cf101bd1cbb7b9f4ae3587aa633928))

## [0.0.124](https://github.com/wessberg/polyfiller/compare/v0.0.123...v0.0.124) (2021-03-09)

### Bug Fixes

- **polyfill:** add whitespace ([7216729](https://github.com/wessberg/polyfiller/commit/7216729d4109d75e15a2a24a4a56d88cb7694215))

## [0.0.123](https://github.com/wessberg/polyfiller/compare/v0.0.122...v0.0.123) (2021-03-09)

### Bug Fixes

- **polyfill:** don't use arrow function ([0592eb0](https://github.com/wessberg/polyfiller/commit/0592eb0ccad169ba548de433cb9fa0bb664c5b14))

## [0.0.122](https://github.com/wessberg/polyfiller/compare/v0.0.121...v0.0.122) (2021-03-09)

### Bug Fixes

- **polyfill:** use minified regenerator-runtime source when minifying ([b255887](https://github.com/wessberg/polyfiller/commit/b2558878c25eccc2879381c3ed1aa0d6d60c4c21))

## [0.0.121](https://github.com/wessberg/polyfiller/compare/v0.0.120...v0.0.121) (2021-03-09)

### Bug Fixes

- **polyfill:** add string detection for minified output ([441d6d4](https://github.com/wessberg/polyfiller/commit/441d6d413bb3652726c1a1e9d5ba3e90b9c5b112))

## [0.0.120](https://github.com/wessberg/polyfiller/compare/v0.0.119...v0.0.120) (2021-03-09)

### Bug Fixes

- **build:** work around swc bugs ([3071cda](https://github.com/wessberg/polyfiller/commit/3071cda62bd81da3bc09329c4bc307f707ebd7ac))

## [0.0.119](https://github.com/wessberg/polyfiller/compare/v0.0.118...v0.0.119) (2021-03-09)

### Bug Fixes

- **swc:** fix a bug where regenerator-runtime would be marked as external. ([53bda66](https://github.com/wessberg/polyfiller/commit/53bda663d419e96705b692f4a2e30e6722ab233d))
- **swc:** fix a bug where regenerator-runtime would be marked as external. ([da13b33](https://github.com/wessberg/polyfiller/commit/da13b33fdec85565a58ef6073e3bf47298eaa6f9))

## [0.0.118](https://github.com/wessberg/polyfiller/compare/v0.0.117...v0.0.118) (2021-03-09)

### Bug Fixes

- **swc:** fix a bug where regenerator-runtime would be marked as external. ([53aff2b](https://github.com/wessberg/polyfiller/commit/53aff2bdb90620f422b6c7c9e1d0a5476078cf6b))

## [0.0.117](https://github.com/wessberg/polyfiller/compare/v0.0.116...v0.0.117) (2021-03-09)

### Bug Fixes

- **env:** respect environment ([54e2ca0](https://github.com/wessberg/polyfiller/commit/54e2ca07cd4311d3bbbcb082fba7112aad4a946a))

## [0.0.116](https://github.com/wessberg/polyfiller/compare/v0.0.115...v0.0.116) (2021-03-08)

### Features

- **FormData:** add FormData polyfill ([c25ff7e](https://github.com/wessberg/polyfiller/commit/c25ff7e971c82f723b30a7a76e5c0eb6c3ac303a))

## [0.0.115](https://github.com/wessberg/polyfiller/compare/v0.0.114...v0.0.115) (2021-03-08)

### Bug Fixes

- **Intl.NumberFormat:** add check for the 'unit' option ([c5c2f72](https://github.com/wessberg/polyfiller/commit/c5c2f7250ef36d6cc07b43a87608ca97376c24ab))

## [0.0.114](https://github.com/wessberg/polyfiller/compare/v0.0.113...v0.0.114) (2020-11-24)

### Bug Fixes

- generate unique cache keys grouped by ecma version ([ac601a4](https://github.com/wessberg/polyfiller/commit/ac601a44b99c8f5d3145b53aca0a63e7e9f2139e))

## [0.0.113](https://github.com/wessberg/polyfiller/compare/v0.0.112...v0.0.113) (2020-11-23)

### Bug Fixes

- ensure that pm2 will update env variables on restart ([cae9fa1](https://github.com/wessberg/polyfiller/commit/cae9fa12900cb8e123e8083f255cbaeda360e461))
- work around swc problem ([2524457](https://github.com/wessberg/polyfiller/commit/2524457f5f675a91894120836abd0eb7f4793ce5))

## [0.0.112](https://github.com/wessberg/polyfiller/compare/v0.0.107...v0.0.112) (2020-11-23)

### Bug Fixes

- add else clause in class-list polyfill to work around Edge 15 bug ([998870e](https://github.com/wessberg/polyfiller/commit/998870ed0b65450db0770b5418dd556825ff10e2))
- interpret 'no' as 'nb' in locale data ([77ea485](https://github.com/wessberg/polyfiller/commit/77ea485b84c0872f238a1bcab1dc20e18cf2a685))
- interpret 'no' as 'nb' in locale data ([b74f2a2](https://github.com/wessberg/polyfiller/commit/b74f2a2b3c8811c4f3c812f7403ca8aaf3c374aa))
- replace [@swc](https://github.com/swc) binary ([8c13e61](https://github.com/wessberg/polyfiller/commit/8c13e61f83f6c59fb531e2e65f29c762ad6ff641))
- roll back swc overwrite ([90796c7](https://github.com/wessberg/polyfiller/commit/90796c76776a48d66faedcfc15a88ae84fc35b2d))
- work around swc problem ([fd9280e](https://github.com/wessberg/polyfiller/commit/fd9280e9d4f10e8240920fa02472a5db26bc12c7))
- **api:** don't share cache root between environments ([1262d65](https://github.com/wessberg/polyfiller/commit/1262d650fc027e7e90f66e9e19f146a5fe9a2ea2))
- **api:** set charset along with Content-Type response headers ([80e9433](https://github.com/wessberg/polyfiller/commit/80e9433ebffdb6b9039920156a853c67146c78cc))
- **build:** add workaround in visitor for swc ([ed8b7eb](https://github.com/wessberg/polyfiller/commit/ed8b7eb54cc0077fb5003973cfc8ed2b7d05a050))
- **build:** use builder pattern when creating unicode escape sequences to solve problems in legacy browsers ([ea64e5c](https://github.com/wessberg/polyfiller/commit/ea64e5c45bce595c9b48c98e1158680974d540a8))
- **cache:** cache checksum for config and flush cache if the config changed ([695b86b](https://github.com/wessberg/polyfiller/commit/695b86b3f5db36ca81f43dd2dd044819c7d13417))
- **cache:** cache checksum for config and flush cache if the config changed ([ba8591e](https://github.com/wessberg/polyfiller/commit/ba8591e29dcf377ed3b9df7042f184efea690883))
- **cache:** cache checksum for config and flush cache if the config changed ([a5e818e](https://github.com/wessberg/polyfiller/commit/a5e818ef37aa9bc5516ecc5e4b77fccb21d1dbf7))
- **class-list:** replace implementation ([d496f7c](https://github.com/wessberg/polyfiller/commit/d496f7c8918856f55f0db925282111c5f47f349b))
- **class-list:** replace implementation ([f7979c1](https://github.com/wessberg/polyfiller/commit/f7979c1c42c363a4c1f668822b3b0af8e0bba131))
- **class-list:** replace implementation ([9ecc1c7](https://github.com/wessberg/polyfiller/commit/9ecc1c7fe4e18446d43d6064388e3f5681bd575e))
- **deploy:** file injector ([6694e09](https://github.com/wessberg/polyfiller/commit/6694e096bcc029497f255aa6d87023332094abd4))
- **deploy:** update deploy script ([9c9970d](https://github.com/wessberg/polyfiller/commit/9c9970dfa22c42a912a7f67d084ff3c05308988f))
- **deploy:** update deploy script ([cd8631b](https://github.com/wessberg/polyfiller/commit/cd8631b645f1a120703b635a89d4ff921a3ccd9d))
- **Intl:** fall back to ISO language 2-code name when the expanded variant isn't available ([6545898](https://github.com/wessberg/polyfiller/commit/6545898541d0809ee296c26bd318f278f56fa7ac))
- **Intl:** normalize all locales being looking up locale-data for them ([7436ca4](https://github.com/wessberg/polyfiller/commit/7436ca465ad2da7ab2b39a193235b2c125909e10))
- **minification:** work around a bug in swc when minifying ([48d72a1](https://github.com/wessberg/polyfiller/commit/48d72a1425ab8e2312effa4e1f3d038c56ba7fa2))
- **minification:** work around a bug in swc when minifying ([5ed083c](https://github.com/wessberg/polyfiller/commit/5ed083c211ed4d2429a63996b13ad9c8b7d7bfd7))
- **object-fit:** object-fit depends on iterable DOM collections ([8d288c6](https://github.com/wessberg/polyfiller/commit/8d288c63aef45d0dd399fb37da3adec85626f128))
- **Promise:** add es.promise.allSettled to es.promise alias since it is now in stage 4 ([2687e8a](https://github.com/wessberg/polyfiller/commit/2687e8a9148ec47f18738f6a15982311970ad134))
- **Promise:** add es.promise.any to es.promise alias since it is now in stage 4 ([b1cf8fe](https://github.com/wessberg/polyfiller/commit/b1cf8fe82b0a8a2c36830364e22788beac385c6f))
- **String:** add es.string.replaceAll to es.string alias since it is now in stage 4 ([8d1cb3e](https://github.com/wessberg/polyfiller/commit/8d1cb3e41a582a930bdd4c2fd1ef0bd82bdb8c55))
- **web components:** use correct entry points ([632989a](https://github.com/wessberg/polyfiller/commit/632989ab8e0d266137d8d296a8f8ee05b8ce5d4f))
- **zone.js:** fix crash ([efc15ed](https://github.com/wessberg/polyfiller/commit/efc15ede227a37bc278b214a18225766ada86d9a))
- add 'os' as external module ([7eb7bc4](https://github.com/wessberg/polyfiller/commit/7eb7bc46ac8ab02933daee84ce2683f46da9df68))
- add environments to deploy script ([f5b24b7](https://github.com/wessberg/polyfiller/commit/f5b24b7fcd8b928e11d2e43cbc88436cef776717))
- add environments to deploy script ([8ac2bf7](https://github.com/wessberg/polyfiller/commit/8ac2bf7a63084073d3e31945f1e0db3c986827b4))
- add environments to deploy script ([4f35eda](https://github.com/wessberg/polyfiller/commit/4f35edaadd6a67596014655a011a9bfc1006aa77))
- add environments to deploy script ([488145b](https://github.com/wessberg/polyfiller/commit/488145b407fd019ed212838b4fff7c44a484e838))
- add environments to deploy script ([25027db](https://github.com/wessberg/polyfiller/commit/25027db6225330ac8d6ca46a6119b6f7f7d1e3fd))
- ensure that server names are unique ([75dba0e](https://github.com/wessberg/polyfiller/commit/75dba0e9fb71b737af00fd672aacc35dd012306e))
- ensure that server names are unique ([bc4fc2e](https://github.com/wessberg/polyfiller/commit/bc4fc2e7b4796a193676c1e8858b6e90d0ff628c))
- ensure that server names are unique ([8464359](https://github.com/wessberg/polyfiller/commit/8464359228e350e919235ebd40b648e350e0a6c3))
- ensure that server names are unique ([a5d0925](https://github.com/wessberg/polyfiller/commit/a5d0925c0788eccef5da667cd477426418a2af48))
- ensure that server names are unique ([e1a4ef1](https://github.com/wessberg/polyfiller/commit/e1a4ef112dd9f0562d03cc0a75efd2f6b7513cbf))
- ensure that server names are unique ([2fac6d9](https://github.com/wessberg/polyfiller/commit/2fac6d96048ffc80ed379f53f7953af000a7e1a6))
- ensure that server names are unique ([c82613d](https://github.com/wessberg/polyfiller/commit/c82613d25c7591ce81417ce0855d524909651a71))
- ensure that server names are unique ([b2f7cef](https://github.com/wessberg/polyfiller/commit/b2f7cef30f4e77a5051d39e6d9cb9a572ec68f23))
- fix deploy script ([df69536](https://github.com/wessberg/polyfiller/commit/df695361b9ae26b512898d840cb26ee439a42529))
- fix deploy script ([c105963](https://github.com/wessberg/polyfiller/commit/c1059633cdfaae3c147df8bb6e14b936c0cdf438))
- fix deploy script ([6c6fb1a](https://github.com/wessberg/polyfiller/commit/6c6fb1a158c62bbf0ff4814dd0cb7b4a7101bb6f))
- fix package-lock ([43b9b9c](https://github.com/wessberg/polyfiller/commit/43b9b9cddde5c9d47deedbd84115d9c121f0942d))
- fix package-lock ([594dbe2](https://github.com/wessberg/polyfiller/commit/594dbe29fd76f10bce86d76994b14570e72f0e0c))
- inject new.target replacement to work around swc bug ([e38ed51](https://github.com/wessberg/polyfiller/commit/e38ed519a2e4123b63c7cfa97c9b370a6770a796))
- inject new.target replacement to work around swc bug ([eeeffe7](https://github.com/wessberg/polyfiller/commit/eeeffe77ff7cbbcd03228d2d9701b1d18214ea92))
- remove bug from deploy script ([5aa01db](https://github.com/wessberg/polyfiller/commit/5aa01dbb787b07442b05577d27fd64d20ee40511))
- remove bug from deploy script ([959f1c4](https://github.com/wessberg/polyfiller/commit/959f1c475023f4f7667a4a2265313fc2d0473af7))
- remove bug from deploy script ([d7e1d80](https://github.com/wessberg/polyfiller/commit/d7e1d808ef7cc754828cdb336c4f0e5cef606716))
- store sourcemap and minify information along with cache identifiers ([e70a5be](https://github.com/wessberg/polyfiller/commit/e70a5be7aa6ee36466c10575343d166b1a7654fb))

### Features

- **api:** add support for new parameter: 'minify'. Setting this will apply minification to the polyfill bundle. Useful in production for minimal bundle size. ([a08f08f](https://github.com/wessberg/polyfiller/commit/a08f08f5d2c1345b34a9216e20a6c6bc1971d503))
- **web components:** use raw source and minify on demand ([eed42e7](https://github.com/wessberg/polyfiller/commit/eed42e78fb5bef0deb7bc8405a08de8876eb498f))
- **web components:** use raw source and minify on demand ([e6f5746](https://github.com/wessberg/polyfiller/commit/e6f574612f9f940b71582caf7cc5edda3a798338))

## [0.0.107](https://github.com/wessberg/polyfiller/compare/v0.0.106...v0.0.107) (2020-10-21)

### Bug Fixes

- update deploy script to also copy over polyfill-lib directory ([273ccc1](https://github.com/wessberg/polyfiller/commit/273ccc161a933b6769cfc42ab8d1859a993ad5cc))

## [0.0.106](https://github.com/wessberg/polyfiller/compare/v0.0.105...v0.0.106) (2020-10-14)

### Bug Fixes

- **object-fit:** update object-fit dependencies ([4f4545c](https://github.com/wessberg/polyfiller/commit/4f4545c8ef421a876a2a178131c82d55e48c604a))
- add error-handling to cache registry ([3aef454](https://github.com/wessberg/polyfiller/commit/3aef454cf082248af4175a8031f39aafbf44c7c2))

## [0.0.105](https://github.com/wessberg/polyfiller/compare/v0.0.103...v0.0.105) (2020-10-13)

### Features

- **object-fit:** update object-fit implementation to one that is more dynamic, fits videos, and supports Shadow DOM ([384890c](https://github.com/wessberg/polyfiller/commit/384890c2b3cb94d336ba5a984541043117de8777))

## [0.0.103](https://github.com/wessberg/polyfiller/compare/v0.0.102...v0.0.103) (2020-07-01)

## [0.0.102](https://github.com/wessberg/polyfiller/compare/v0.0.101...v0.0.102) (2020-05-04)

## [0.0.101](https://github.com/wessberg/polyfiller/compare/v0.0.100...v0.0.101) (2020-05-04)

### Bug Fixes

- add support for QQ browser and MiuiBrower. Closes [#14](https://github.com/wessberg/polyfiller/issues/14). Closes [#16](https://github.com/wessberg/polyfiller/issues/16) ([5e2d710](https://github.com/wessberg/polyfiller/commit/5e2d710aeeafafa79ddea04cdad71c435e7e11ac))

## [0.0.100](https://github.com/wessberg/polyfiller/compare/v0.0.99...v0.0.100) (2020-04-06)

### Bug Fixes

- **pointer-event:** when combining the 'pointer-event' feature with the 'shadow-dom' feature, 'shadow-dom' must always be included first, given that both mutate EventTarget.prototype.addEventListener ([00772bc](https://github.com/wessberg/polyfiller/commit/00772bc292c96912423c11c5500d24ab3dfaa035))

## [0.0.99](https://github.com/wessberg/polyfiller/compare/v0.0.98...v0.0.99) (2020-04-06)

### Bug Fixes

- update ScopingShim when requesting web-components with the 'experimental' flagC ([d254f70](https://github.com/wessberg/polyfiller/commit/d254f70338beb624a5246b24fabe0c13a9286e56))

## [0.0.98](https://github.com/wessberg/polyfiller/compare/v0.0.97...v0.0.98) (2020-03-06)

## [0.0.97](https://github.com/wessberg/polyfiller/compare/v0.0.96...v0.0.97) (2020-03-04)

## [0.0.96](https://github.com/wessberg/polyfiller/compare/v0.0.95...v0.0.96) (2020-03-04)

### Features

- **css.focus-visible:** add support for the :focus-visible pseudo-class ([cac6e5a](https://github.com/wessberg/polyfiller/commit/cac6e5ad25678b04b5b9b9837c7f95a9fc283bdf))

## [0.0.95](https://github.com/wessberg/polyfiller/compare/v0.0.94...v0.0.95) (2020-03-04)

### Bug Fixes

- update relative paths for some polyfills ([d1e09a1](https://github.com/wessberg/polyfiller/commit/d1e09a1b3d614228281fb76a15b72057daedc1f5))

## [0.0.94](https://github.com/wessberg/polyfiller/compare/v0.0.93...v0.0.94) (2020-03-04)

### Features

- **es.map:** add support for the Stage-2 proposal Map.prototype.upsert ([2315311](https://github.com/wessberg/polyfiller/commit/2315311211547a7bc0a5d7e41f2ef33f17407fc8))
- **es.promise:** add support for the Stage-3 proposal Promise.any ([d8ce542](https://github.com/wessberg/polyfiller/commit/d8ce542d831a8b95bc63f109ed51b55295752120))

## [0.0.93](https://github.com/wessberg/polyfiller/compare/v0.0.92...v0.0.93) (2019-10-01)

## [0.0.92](https://github.com/wessberg/polyfiller/compare/v0.0.86...v0.0.92) (2019-09-25)

## [0.0.86](https://github.com/wessberg/polyfiller/compare/v0.0.85...v0.0.86) (2019-09-09)

## [0.0.85](https://github.com/wessberg/polyfiller/compare/v0.0.83...v0.0.85) (2019-07-18)

## [0.0.83](https://github.com/wessberg/polyfiller/compare/v0.0.82...v0.0.83) (2019-05-08)

### Features

- **logging:** adds referrer logging ([77cbce8](https://github.com/wessberg/polyfiller/commit/77cbce8e70d2d12adc361df16a482869a71a3e91))

## [0.0.82](https://github.com/wessberg/polyfiller/compare/v0.0.81...v0.0.82) (2019-04-11)

## [0.0.81](https://github.com/wessberg/polyfiller/compare/v0.0.80...v0.0.81) (2019-04-06)

### Bug Fixes

- **proto:** makes the proto polyfill not entirely crash IE 8. Fixes [#5](https://github.com/wessberg/polyfiller/issues/5) ([4cfec27](https://github.com/wessberg/polyfiller/commit/4cfec276e8605dd4cfa2610a3f6e27367f88b36e))

## [0.0.80](https://github.com/wessberg/polyfiller/compare/v0.0.79...v0.0.80) (2019-04-06)

### Features

- **polyfill:** adds a 'proto' polyfill that adds support for '**proto**' on IE <11 ([41ba4c2](https://github.com/wessberg/polyfiller/commit/41ba4c235a37d1ef7f8f7decb14f7b852c9bdf83))

## [0.0.79](https://github.com/wessberg/polyfiller/compare/v0.0.78...v0.0.79) (2019-04-06)

### Bug Fixes

- **bug:** fixes a bug that would lead to crashes when requesting global-this ([a24d038](https://github.com/wessberg/polyfiller/commit/a24d03828ed067cb538822eefd6b3d2a2c2b316f))

## [0.0.78](https://github.com/wessberg/polyfiller/compare/v0.0.77...v0.0.78) (2019-04-02)

### Bug Fixes

- **bug:** stops auto-applying zone patches for ShadyDOM when requesting both Zone and shadow-dom since this may lead to issues in IE11 ([fb6c5cf](https://github.com/wessberg/polyfiller/commit/fb6c5cfb923c95a58f63f275489cddcce38c5c1e))

## [0.0.77](https://github.com/wessberg/polyfiller/compare/v0.0.76...v0.0.77) (2019-04-01)

## [0.0.76](https://github.com/wessberg/polyfiller/compare/v0.0.75...v0.0.76) (2019-04-01)

### Features

- **shadow-dom:** adds a 'experimental' option to the shadow-dom polyfill which may reduce bugs in older browsers such as IE and Edge <=15 ([fb1a8f9](https://github.com/wessberg/polyfiller/commit/fb1a8f9ceecf43830c2c62016f67d4ecb8a519c2))

## [0.0.75](https://github.com/wessberg/polyfiller/compare/v0.0.74...v0.0.75) (2019-03-28)

### Bug Fixes

- **bug:** fixes an issue where polyfills with es2015 block scoping would cause issues in older browers ([4efd9dd](https://github.com/wessberg/polyfiller/commit/4efd9dd9e829613d8185174a83e852caf0136554))

### Features

- **zone:** added ResizeObserver patch for Zone ([1cdcbb5](https://github.com/wessberg/polyfiller/commit/1cdcbb5160115115a14cc026888fd006d59e26b2))
- **zone.js:** adds additional configuration options for Zone.js ([315b0c1](https://github.com/wessberg/polyfiller/commit/315b0c19ee8602b09888730cc1f1de8233ddd77e))

## [0.0.74](https://github.com/wessberg/polyfiller/compare/v0.0.73...v0.0.74) (2019-03-27)

### Bug Fixes

- **resize-observer:** Changes ResizeObserver polyfill implementation since the current one causes significant performance issues in some browsers ([aa5ffd8](https://github.com/wessberg/polyfiller/commit/aa5ffd863fc0202dad88a4ffa04defae38023e98))

## [0.0.73](https://github.com/wessberg/polyfiller/compare/v0.0.72...v0.0.73) (2019-03-17)

### Bug Fixes

- **zone:** fixes an issue where zone would break polyfill bundles for web workers/service workers ([22b45c5](https://github.com/wessberg/polyfiller/commit/22b45c5fb572504202176f36f7238241947dc3cc))

## [0.0.72](https://github.com/wessberg/polyfiller/compare/v0.0.71...v0.0.72) (2019-03-12)

### Bug Fixes

- **feature detection:** adds feature detections for newer features such as Intl.ListFormat, String.prototype.matchAll, and Constructable Stylesheets/DocumentOrShadowRoot.adoptedStyleSheets ([c14c118](https://github.com/wessberg/polyfiller/commit/c14c1182a4ee69b614f8bf8b21336a4f9f849275))

## [0.0.71](https://github.com/wessberg/polyfiller/compare/v0.0.70...v0.0.71) (2019-03-12)

### Bug Fixes

- **intl:** fixes intl polyfills ([3e3a553](https://github.com/wessberg/polyfiller/commit/3e3a553083a3ea2ab3b273d31bc9bf1c848d31a4))

## [0.0.70](https://github.com/wessberg/polyfiller/compare/v0.0.69...v0.0.70) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([adede93](https://github.com/wessberg/polyfiller/commit/adede93475c8ed86cbdb66ca38d83778edd6df0a))

## [0.0.69](https://github.com/wessberg/polyfiller/compare/v0.0.68...v0.0.69) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([030ea4b](https://github.com/wessberg/polyfiller/commit/030ea4b9ede9abdabdf5d34dbe7275749c48afb4))

## [0.0.68](https://github.com/wessberg/polyfiller/compare/v0.0.67...v0.0.68) (2019-03-12)

### Bug Fixes

- **safari:** fixes Intl issue ([590bcfc](https://github.com/wessberg/polyfiller/commit/590bcfc91f78691ad27e250ce6bade7653a47a70))

## [0.0.67](https://github.com/wessberg/polyfiller/compare/v0.0.66...v0.0.67) (2019-03-11)

### Bug Fixes

- **safari:** fixes Intl issue in Safari with PluralRules ([e278c75](https://github.com/wessberg/polyfiller/commit/e278c75e3bcc1739998c3ea24a84b571e43ca1b7))

## [0.0.66](https://github.com/wessberg/polyfiller/compare/v0.0.65...v0.0.66) (2019-03-07)

### Bug Fixes

- **hosting:** fixes a bug with resolving file paths in Docker environments ([e13be77](https://github.com/wessberg/polyfiller/commit/e13be777d9d73acd901ecdf7cc518212eb3db659))

## [0.0.65](https://github.com/wessberg/polyfiller/compare/v0.0.64...v0.0.65) (2019-03-07)

### Bug Fixes

- **hosting:** fixes a bug in Docker environments ([bcf6028](https://github.com/wessberg/polyfiller/commit/bcf6028bb3e858191bd3c3a76c43416f4cd6fb6f))

## [0.0.64](https://github.com/wessberg/polyfiller/compare/v0.0.63...v0.0.64) (2019-03-05)

### Bug Fixes

- **hosting:** fixes some issues with self-hosting when dependencies are hoisted ([d4958fd](https://github.com/wessberg/polyfiller/commit/d4958fd47f7c1a6436c464441a9517276d75194c))

## [0.0.63](https://github.com/wessberg/polyfiller/compare/v0.0.62...v0.0.63) (2019-03-01)

### Bug Fixes

- **custom-elements:** adds MutationObserver as dependency of the custom-elements polyfill ([3716111](https://github.com/wessberg/polyfiller/commit/3716111bf6abff04fe0e297a6d29a3d9d871420b))

## [0.0.62](https://github.com/wessberg/polyfiller/compare/v0.0.61...v0.0.62) (2019-02-16)

### Features

- **polyfill:** Adds polyfill for Constructable StyleSheets ([b9f9989](https://github.com/wessberg/polyfiller/commit/b9f9989b6fcd4fb723d73e3c9ee47a79e324f825))

## [0.0.61](https://github.com/wessberg/polyfiller/compare/v0.0.60...v0.0.61) (2019-02-07)

### Bug Fixes

- **polyfill:** fixes a caching issue ([964449f](https://github.com/wessberg/polyfiller/commit/964449fcdac3eef547d058b84bab50a84ded6efa))
- **polyfill:** updated supported contexts for requestIdleCallback ([5261d13](https://github.com/wessberg/polyfiller/commit/5261d1380b820eb9099319afc14d221087a1d816))

## [0.0.60](https://github.com/wessberg/polyfiller/compare/v0.0.59...v0.0.60) (2019-02-07)

### Features

- **contexts:** adds support for passing a context of either 'window', 'worker', or 'node' as a query parameter ([5266c25](https://github.com/wessberg/polyfiller/commit/5266c258638730b64570a617a9d6e72e85ac8454)), closes [#2](https://github.com/wessberg/polyfiller/issues/2)
- **polyfill:** adds missing ESNext map methods: 'Map.#every, 'Map.#find', 'Map.#find-key', 'Map.#includes', 'Map.#key-of', 'Map.#reduce', Map.'#some', and 'Map.#update' ([1307877](https://github.com/wessberg/polyfiller/commit/130787762d70f16a1744e489029a3975e0b3c570))
- **polyfill:** adds support for 'globalThis' ([ffb3e0d](https://github.com/wessberg/polyfiller/commit/ffb3e0d172ceaeb8c979f93907b6e89f18144900))

## [0.0.59](https://github.com/wessberg/polyfiller/compare/v0.0.58...v0.0.59) (2019-02-04)

## [0.0.58](https://github.com/wessberg/polyfiller/compare/v0.0.57...v0.0.58) (2019-02-04)

### Bug Fixes

- **intl:** fixes an issue where Intl.PluralRules would not be polyfilled. ([72db7d3](https://github.com/wessberg/polyfiller/commit/72db7d34a924d81fa6cd61fac8f86b7518e365cf))

## [0.0.57](https://github.com/wessberg/polyfiller/compare/v0.0.56...v0.0.57) (2019-01-28)

### Bug Fixes

- **edge:** Bumps dependencies to fix an issue where Edge 16 could report as Edge 18 under some circumstances ([417a3b9](https://github.com/wessberg/polyfiller/commit/417a3b9ffd346da7a84e234b26a2d07f752543cd))

## [0.0.56](https://github.com/wessberg/polyfiller/compare/v0.0.55...v0.0.56) (2019-01-28)

### Bug Fixes

- **edge:** Bumps dependencies to fix an issue where Edge 16 could report as Edge 18 under some circumstances ([aaa2ca6](https://github.com/wessberg/polyfiller/commit/aaa2ca63a3f3107b5343862876cc147f58e16145))

## [0.0.55](https://github.com/wessberg/polyfiller/compare/v0.0.54...v0.0.55) (2019-01-24)

### Bug Fixes

- **safari:** fixes an issue where intersection-observer and web-animations would not apply to Safari v12 (not TP) ([3cd66d0](https://github.com/wessberg/polyfiller/commit/3cd66d0f7ac60fd51ba10047cbe79b03081ad44b))

## [0.0.54](https://github.com/wessberg/polyfiller/compare/v0.0.53...v0.0.54) (2019-01-24)

### Features

- **polyfill:** made 'animation' an alias for the polyfill 'web-animations' ([7fa03e9](https://github.com/wessberg/polyfiller/commit/7fa03e929a7f8d94830ed6674bf0e9bd0536e9ec))

## [0.0.53](https://github.com/wessberg/polyfiller/compare/v0.0.52...v0.0.53) (2019-01-24)

### Bug Fixes

- **dependencies:** updated Zone.js version to 0.8.29 ([28a1228](https://github.com/wessberg/polyfiller/commit/28a122891c972b571181ca2afa5a3e0502e626db))
- **project:** adds Prettier, better release pipeline ([17a6ce2](https://github.com/wessberg/polyfiller/commit/17a6ce2d9fb67173c44519a46f6c0a741c8ee272))
- **project:** updated deploy scripts ([a6c6cf4](https://github.com/wessberg/polyfiller/commit/a6c6cf417cd87ceefbb078aefc0bdbb4577c59e7))
- **project:** updated test scripts ([7bd9e17](https://github.com/wessberg/polyfiller/commit/7bd9e17a898f30ee11b36e19a38e2154978c3253))

### Features

- **contributing:** adds Prettier formatting to the project ([edc62e6](https://github.com/wessberg/polyfiller/commit/edc62e68350d99fb85f07b888e9c962afe740c1d))
- **polyfill:** es.set.is-disjoint-with has been renamed to es.set.is-disjoint-from to align with the current spec proposal ([0dfb26e](https://github.com/wessberg/polyfiller/commit/0dfb26e8b04d2a571260be68e18287f6ea695ed2))

## [0.0.52](https://github.com/wessberg/polyfiller/compare/v0.0.51...v0.0.52) (2019-01-18)

## [0.0.51](https://github.com/wessberg/polyfiller/compare/v0.0.50...v0.0.51) (2019-01-18)

### Bug Fixes

- **server:** fixes issue where OPTIONS requests would return METHOD_NOT_ALLOWED ([3d6f950](https://github.com/wessberg/polyfiller/commit/3d6f950b8900ee7ac2e759add075b199cc7972ef))

## [0.0.50](https://github.com/wessberg/polyfiller/compare/v0.0.49...v0.0.50) (2019-01-18)

### Bug Fixes

- **server:** fixes issue where OPTIONS requests would return METHOD_NOT_ALLOWED ([0ebc4ef](https://github.com/wessberg/polyfiller/commit/0ebc4ef2a3dba2b63e5d0de453c3d55f1578e5aa))

### Features

- **polyfill:** adds support for the proposed new Set methods: Set.prototype.isDisjointWith, Set.prototype.isSubsetOf, and Set.prototype.isSupersetOf ([90e98d2](https://github.com/wessberg/polyfiller/commit/90e98d2436cd5641c4a5183f3691bcaa8241d119))

## [0.0.49](https://github.com/wessberg/polyfiller/compare/v0.0.48...v0.0.49) (2019-01-15)

### Features

- **polyfill:** adds polyfill for Intl.ListFormat ([1dce148](https://github.com/wessberg/polyfiller/commit/1dce14880a569046d97880f2bf6c97d562f47d10))

## [0.0.48](https://github.com/wessberg/polyfiller/compare/v0.0.47...v0.0.48) (2019-01-14)

### Features

- **core:** adds support for Intl.RelativeTimeFormat ([749bef9](https://github.com/wessberg/polyfiller/commit/749bef9913021d02d7c38d36021a3f9f2acf8d79))
- **polyfill:** Adds support for the scroll-behavior CSS property and extensions to the Element interface via the polyfill name: 'scroll-behavior' ([f5a8957](https://github.com/wessberg/polyfiller/commit/f5a8957447ec2e50321ddb124a497c448f442dc7))

## [0.0.47](https://github.com/wessberg/polyfiller/compare/v0.0.46...v0.0.47) (2019-01-02)

### Bug Fixes

- **chore:** adds feature detections for Object.fromEntries and Symbol.description, both of which have shipped in some browsers now ([04205ab](https://github.com/wessberg/polyfiller/commit/04205aba8bd21c7bda852a502afbb2b14adb0568))

## [0.0.46](https://github.com/wessberg/polyfiller/compare/v0.0.45...v0.0.46) (2018-12-19)

## [0.0.45](https://github.com/wessberg/polyfiller/compare/v0.0.44...v0.0.45) (2018-12-06)

## [0.0.44](https://github.com/wessberg/polyfiller/compare/v0.0.43...v0.0.44) (2018-12-06)

## [0.0.43](https://github.com/wessberg/polyfiller/compare/v0.0.42...v0.0.43) (2018-11-14)

## [0.0.42](https://github.com/wessberg/polyfiller/compare/v0.0.41...v0.0.42) (2018-11-14)

## [0.0.41](https://github.com/wessberg/polyfiller/compare/v0.0.40...v0.0.41) (2018-11-14)

## [0.0.40](https://github.com/wessberg/polyfiller/compare/v0.0.39...v0.0.40) (2018-10-31)

## [0.0.39](https://github.com/wessberg/polyfiller/compare/v0.0.38...v0.0.39) (2018-10-31)

## [0.0.38](https://github.com/wessberg/polyfiller/compare/v0.0.37...v0.0.38) (2018-10-30)

### Features

- **chore:** Bumped dependencies ([dec27c9](https://github.com/wessberg/polyfiller/commit/dec27c96d84bf2b1e7da8ef2aa7311d1628504c7))

## [0.0.37](https://github.com/wessberg/polyfiller/compare/v0.0.36...v0.0.37) (2018-10-28)

## [0.0.36](https://github.com/wessberg/polyfiller/compare/v0.0.35...v0.0.36) (2018-10-24)

## [0.0.35](https://github.com/wessberg/polyfiller/compare/v0.0.34...v0.0.35) (2018-10-18)

### Features

- a new header, 'x-applied-polyfills' ([50b8010](https://github.com/wessberg/polyfiller/commit/50b8010b4d5a0ec1d5466ffffa7a9e1486192475))

## [0.0.34](https://github.com/wessberg/polyfiller/compare/v0.0.33...v0.0.34) (2018-10-18)

## [0.0.33](https://github.com/wessberg/polyfiller/compare/v0.0.32...v0.0.33) (2018-10-18)

### Bug Fixes

- **chore:** SystemJS depends on Promise and fetch (for package maps) ([9ff236c](https://github.com/wessberg/polyfiller/commit/9ff236c22e528902e077f0bacd326d65094805e4))

## [0.0.32](https://github.com/wessberg/polyfiller/compare/v0.0.31...v0.0.32) (2018-10-18)

### Features

- **SystemJS:** adds support for SystemJS 2.0 ([50ce832](https://github.com/wessberg/polyfiller/commit/50ce8323052ffe891ac0b4b7d8ad29088871b356))

## [0.0.31](https://github.com/wessberg/polyfiller/compare/v0.0.30...v0.0.31) (2018-10-08)

### Features

- Added polyfill support for ResizeObserver ([2a6b549](https://github.com/wessberg/polyfiller/commit/2a6b549b3689fccccf6222fa4c0e29f6067ee2d9))
- Added polyfill support for setImmediate ([92ab7eb](https://github.com/wessberg/polyfiller/commit/92ab7eb186fe9126de5c3ed7867b1d9f7059ec59))

## [0.0.30](https://github.com/wessberg/polyfiller/compare/v0.0.29...v0.0.30) (2018-09-24)

## [0.0.29](https://github.com/wessberg/polyfiller/compare/v0.0.28...v0.0.29) (2018-09-24)

## [0.0.28](https://github.com/wessberg/polyfiller/compare/v0.0.27...v0.0.28) (2018-09-20)

### Features

- Added support for 'requestidlecallback' ([f8df4bb](https://github.com/wessberg/polyfiller/commit/f8df4bb92037f3599a6f8e78d50b3f363d2eafc6))

## [0.0.27](https://github.com/wessberg/polyfiller/compare/v0.0.26...v0.0.27) (2018-09-09)

## [0.0.26](https://github.com/wessberg/polyfiller/compare/v0.0.25...v0.0.26) (2018-09-09)

## [0.0.25](https://github.com/wessberg/polyfiller/compare/v0.0.24...v0.0.25) (2018-08-30)

## [0.0.24](https://github.com/wessberg/polyfiller/compare/v0.0.23...v0.0.24) (2018-08-30)

## [0.0.23](https://github.com/wessberg/polyfiller/compare/v0.0.22...v0.0.23) (2018-06-21)

## [0.0.22](https://github.com/wessberg/polyfiller/compare/v0.0.21...v0.0.22) (2018-06-15)

## [0.0.21](https://github.com/wessberg/polyfiller/compare/v0.0.20...v0.0.21) (2018-06-15)

## [0.0.20](https://github.com/wessberg/polyfiller/compare/v0.0.19...v0.0.20) (2018-06-13)

## [0.0.19](https://github.com/wessberg/polyfiller/compare/v0.0.18...v0.0.19) (2018-06-13)

## [0.0.18](https://github.com/wessberg/polyfiller/compare/v0.0.17...v0.0.18) (2018-06-12)

## [0.0.17](https://github.com/wessberg/polyfiller/compare/v0.0.16...v0.0.17) (2018-06-12)

## [0.0.16](https://github.com/wessberg/polyfiller/compare/v0.0.15...v0.0.16) (2018-06-12)

## [0.0.15](https://github.com/wessberg/polyfiller/compare/v0.0.14...v0.0.15) (2018-06-12)

## [0.0.14](https://github.com/wessberg/polyfiller/compare/v0.0.13...v0.0.14) (2018-06-12)

## [0.0.13](https://github.com/wessberg/polyfiller/compare/v0.0.12...v0.0.13) (2018-06-12)

## [0.0.12](https://github.com/wessberg/polyfiller/compare/v0.0.11...v0.0.12) (2018-06-12)

## [0.0.11](https://github.com/wessberg/polyfiller/compare/v0.0.10...v0.0.11) (2018-06-12)

## [0.0.10](https://github.com/wessberg/polyfiller/compare/v0.0.9...v0.0.10) (2018-06-07)

## [0.0.9](https://github.com/wessberg/polyfiller/compare/v0.0.8...v0.0.9) (2018-05-28)

## [0.0.8](https://github.com/wessberg/polyfiller/compare/v0.0.7...v0.0.8) (2018-05-24)

## [0.0.7](https://github.com/wessberg/polyfiller/compare/v0.0.6...v0.0.7) (2018-05-19)

## [0.0.6](https://github.com/wessberg/polyfiller/compare/v0.0.5...v0.0.6) (2018-05-19)

## [0.0.5](https://github.com/wessberg/polyfiller/compare/v0.0.4...v0.0.5) (2018-05-19)

## [0.0.4](https://github.com/wessberg/polyfiller/compare/v0.0.3...v0.0.4) (2018-05-19)

## [0.0.3](https://github.com/wessberg/polyfiller/compare/v0.0.2...v0.0.3) (2018-05-18)

## [0.0.2](https://github.com/wessberg/polyfiller/compare/v0.0.1...v0.0.2) (2018-05-18)

## 0.0.1 (2018-05-18)
