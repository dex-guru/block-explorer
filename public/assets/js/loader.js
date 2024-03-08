var cmpChecker = (function () {
  // ver 137 - cmp ready -- with detector
  var CDN_SERVER = 'https://cdn.adx.ws'
  var API_URL = 'https://request.adx.ws'
  var AD_SERVER_URL = API_URL + '/ad'

  var cmpData = {
    tcfeu: '',
    gpp: '',
    usp: '',
  }
  var queueAds = []
  var cookieSynced = false
  var treeChangeDetected = false

  if (typeof window.loaderJsExecuted === 'undefined') {
    window.loaderJsExecuted = true

    // Detector routine
    function detect() {
      var data = {}
      data.width = 'NIL'
      if (typeof window.innerWidth != 'undefined') {
        data.width = window.innerWidth
      }
      data.height = 'NIL'
      if (typeof window.innerHeight != 'undefined') {
        data.height = window.innerHeight
      }
      data.language = 'NIL'
      if (typeof navigator.language != 'undefined') {
        data.language = navigator.language
      }
      data.languages = 'NIL'
      if (typeof navigator.languages != 'undefined') {
        data.languages = navigator.languages
      }
      data.timestamp = new Date().toLocaleString('en-US')
      data.cookie = 'NIL'
      if (typeof navigator.cookieEnabled != 'undefined') {
        data.cookie = navigator.cookieEnabled
      }
      data.processors = 'NIL'
      if (typeof navigator.hardwareConcurrency != 'undefined') {
        data.processors = navigator.hardwareConcurrency
      }
      data.touchpoints = 'NIL'
      if (typeof navigator.maxTouchPoints != 'undefined') {
        data.touchpoints = navigator.maxTouchPoints
      }
      data.pdf = 'NIL'
      if (typeof navigator.pdfViewerEnabled != 'undefined') {
        data.pdf = navigator.pdfViewerEnabled
      }
      data.workers = 'NIL'
      if ('serviceWorker' in navigator) {
        data.workers = true
      }
      data.clipboard = 'NIL'
      if ('clipboard' in navigator) {
        data.clipboard = true
      }
      data.geolocation = 'NIL'
      if ('geolocation' in navigator) {
        data.geolocation = true
      }
      function getVideoCardInfo() {
        const gl = document.createElement('canvas').getContext('webgl')

        if (!gl) {
          return 'NIL'
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

        if (debugInfo) {
          return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          }
        }

        return 'NIL'
      }
      data.gpu = getVideoCardInfo()
      // console.log(JSON.stringify(data));
      // console.log(btoa(JSON.stringify(data)));
      return data
    }
    var detectorData = detect()

    var waitForTcfApiCalled = false // Flag to track if waitForTcfApi has been called

    function waitForTcfApi(callback, interval, maxAttempts) {
      // If waitForTcfApi has been called before, return early
      if (waitForTcfApiCalled) {
        console.log('waitForTcfApi already called. Skipping.')
        return
      }

      // Use default values for interval and maxAttempts if not provided
      interval = interval || 100
      maxAttempts = maxAttempts || 10

      var attempts = 0

      function checkTcfApi() {
        attempts++

        if (typeof window.__tcfapi !== 'undefined') {
          callback()
          waitForTcfApiCalled = true // Set the flag to true after calling waitForTcfApi
        } else if (attempts < maxAttempts) {
          setTimeout(checkTcfApi, interval)
        } else {
          console.log('sevioads: Max attempts reached. __tcfapi not found.')
          postCmpAction(cmpData)
          waitForTcfApiCalled = true // Set the flag to true after reaching max attempts
        }
      }

      checkTcfApi()
    }

    // Usage example
    waitForTcfApi(function () {
      // Your code to be executed after __tcfapi is present
      console.log('sevioads: __tcfapi is now available.')
      var checkCMP = function () {
        if (typeof __gpp !== 'undefined' && typeof __gpp === 'function') {
          try {
            var gppData = __gpp('ping')
            cmpData.gpp = gppData.gppString || ''
            postCmpAction(cmpData)
          } catch (e) {}
        }

        if (typeof __uspapi !== 'undefined' && typeof __uspapi === 'function') {
          try {
            __uspapi('getUSPData', 1, function (uspData, success) {
              if (success) {
                cmpData.usp = uspData.uspString || ''
                postCmpAction(cmpData)
              }
            })
          } catch (e) {}
        }

        if (typeof __tcfapi !== 'undefined' && typeof __tcfapi === 'function') {
          try {
            __tcfapi('addEventListener', 2, function (tcData, success) {
              if (success && tcData.eventStatus === 'tcloaded') {
                cmpData.tcfeu = tcData.tcString
                cmpData.state = 'tcloaded'
                postCmpAction(cmpData)
              } else if (success && tcData.eventStatus === 'useractioncomplete') {
                console.log('completed the action')
                cmpData.tcfeu = tcData.tcString
                cmpData.state = 'useractioncomplete'
                postCmpAction(cmpData)
              } else {
                console.log('sevioads: TCF not loaded') // not loading ads
              }
            })
          } catch (e) {}
        } else {
          cmpData.state = 'UNKNOWN'
          postCmpAction(cmpData)
        }
      }
      checkCMP()
    })

    var postCmpActionCalled = false
    var postCmpAction = function (cmpData) {
      if (!postCmpActionCalled) {
        // detect inventoryId and call /uid
        postCmpActionCalled = true

        // BEGIN - function for getting ads
        window.sevioads = (function () {
          var refreshTimerInitialized = false
          var remoteParamUrls = []
          var groupedRefresh = {}
          var tbStoreKey = 'refreshStoreTB'
          var doNotRefresh = []
          var initialPath = window.location.pathname
          var sevioDebugActive = false
          var urlSearchParams = new URLSearchParams(window.location.search)
          var sevioDebug = urlSearchParams.get('sevioDebug')

          if (sevioDebug === 'true') sevioDebugActive = true

          // Ensure the loader is executed only once
          if (window.sevioadsInitialized) {
            return window.sevioads
          }
          window.sevioadsInitialized = true

          // if (
          //   document.location.hostname.endsWith('.marketcapof.com') ||
          //   document.location.hostname === 'marketcapof.com' ||
          //   document.location.hostname === 'coindoo.com' ||
          //   document.location.hostname === 'localhost'
          // ) {
          //   // Create the impAndViewableLogger box
          //   var impCnt = 0;
          //   var viewableCnt = 0;
          //   var impAndViewableLogger = document.createElement('div');
          //   impAndViewableLogger.id = 'impAndViewableLogger';
          //   impAndViewableLogger.style.position = 'fixed';
          //   impAndViewableLogger.style.bottom = '20px';
          //   impAndViewableLogger.style.right = '20px';
          //   impAndViewableLogger.style.backgroundColor = '#f0f0f0';
          //   impAndViewableLogger.style.padding = '10px';
          //   impAndViewableLogger.style.borderRadius = '5px';
          //   impAndViewableLogger.style.boxShadow =
          //     '0px 0px 10px rgba(0, 0, 0, 0.1)';
          //   impAndViewableLogger.style.zIndex = '9999';
          //   impAndViewableLogger.style.display = 'flex'; // Add flex display
          //
          //   // Create the first huge number div
          //   var hugeNumber1 = document.createElement('div');
          //   hugeNumber1.id = 'hugeNumber1';
          //   hugeNumber1.style.fontSize = '16px';
          //   hugeNumber1.style.fontWeight = 'bold';
          //   hugeNumber1.style.color = '#333';
          //   hugeNumber1.innerHTML = '0';
          //
          //   // Create a vertical line between the two numbers
          //   var verticalLine = document.createElement('div');
          //   verticalLine.style.width = '1px';
          //   verticalLine.style.backgroundColor = '#ccc';
          //   verticalLine.style.margin = '0 10px'; // Adjust margin as needed
          //
          //   // Create the second huge number div
          //   var hugeNumber2 = document.createElement('div');
          //   hugeNumber2.id = 'hugeNumber2';
          //   hugeNumber2.style.fontSize = '16px';
          //   hugeNumber2.style.fontWeight = 'bold';
          //   hugeNumber2.style.color = '#333';
          //   hugeNumber2.innerHTML = '0';
          //
          //   // Append the huge number divs and the line to the impAndViewableLogger box
          //   impAndViewableLogger.appendChild(hugeNumber1);
          //   impAndViewableLogger.appendChild(verticalLine);
          //   impAndViewableLogger.appendChild(hugeNumber2);
          //
          //   // Append the impAndViewableLogger box to the document body
          //   document.body.appendChild(impAndViewableLogger);
          // }

          var sevioads = {
            push: function (args) {
              window.sevioadsData = window.sevioadsData || []
              if (Array.isArray(args)) {
                var zoneIdsToMatch = []

                // Loop within the given params array and load the ads
                for (var i = 0; i < args.length; i++) {
                  args[i].loaded = true
                  window.sevioadsData.push(args[i])
                  zoneIdsToMatch.push(args[i].zone)
                  localStorage.removeItem('zoneView_' + args[i].zone)
                }

                // Convert NodeList to an array using a loop
                var adPlaceholders = document.querySelectorAll('.sevioads')
                var sevioadsArray = []
                for (var j = 0; j < adPlaceholders.length; j++) {
                  sevioadsArray.push(adPlaceholders[j])
                }

                // Filter placeholders elements based on the data-zone attribute
                var filteredElements = []
                for (var k = 0; k < sevioadsArray.length; k++) {
                  var element = sevioadsArray[k]
                  var dataZoneValue = element.getAttribute('data-zone')
                  if (zoneIdsToMatch.indexOf(dataZoneValue) !== -1) {
                    filteredElements.push(element)
                  }
                }
              } else {
                // fallback for the case when we push the data as it used to be - not as array
                // this should be removed after a while
                args.loaded = false
                window.sevioadsData.push(args)

                var allAdPlaceholders = document.querySelectorAll('.sevioads')

                // Specific data-zone attribute value to filter by
                var specificDataZoneId = args.zone
                localStorage.removeItem('zoneView_' + args.zone)
                var elementsArray = Array.prototype.slice.call(allAdPlaceholders)

                // Use filter to create a new array with elements matching the specified data-zone attribute
                var filteredElements = elementsArray.filter(function (element) {
                  return element.getAttribute('data-zone') === specificDataZoneId
                })
              }

              if (!cookieSynced) {
                this.cookieSyncing(args)
                queueAds.push({ foundAds: filteredElements })
              } else {
                sevioads.loadingRequest({ foundAds: filteredElements })
              }

              loadBannerAd['initialized'] = function (args) {
                return new this(args)
              }
              loadBannerAd['initialized'](args)
            },

            cookieSyncing: function (args) {
              if (Array.isArray(args)) {
                var inventoryId = args[0].inventoryId
              } else {
                var inventoryId = args.inventoryId
              }
              sevioads.loadServerUrl({
                serverUrl: API_URL + '/uids',
                cFunction: function (response) {
                  if (response.xhttp.readyState === 4 && response.xhttp.status === 200) {
                    var bidderItems = JSON.parse(response.xhttp.responseText)
                    sevioads.biddersHandler(bidderItems.bidders, function () {
                      sevioads.processQueuedAds()
                      // Now you can proceed to load your ads or perform other actions
                    })
                  } else {
                    sevioads.processQueuedAds()
                    // normal loading without injecting bidders
                  }
                },
                serverMethod: 'POST',
                cType: 'application/json',
                data: JSON.stringify({
                  inventoryId: inventoryId,
                  tcfeu: cmpData.tcfeu,
                  usp: cmpData.usp,
                  gpp: cmpData.gpp,
                }),
              })

              cookieSynced = true
            },

            loadSyncItem: function (bidderItem, callback) {
              if (bidderItem.userSyncMethod === 'REDIRECT') {
                var img = new Image()
                img.onload = function () {
                  callback()
                }

                img.onerror = function () {
                  callback()
                }
                img.src = bidderItem.url
                img.style.display = 'none'
                document.body.appendChild(img)
              }
              if (bidderItem.userSyncMethod === 'IFRAME') {
                var iframeSync = document.createElement('iframe')
                iframeSync.style.display = 'none'

                iframeSync.onload = function () {
                  callback()
                  document.body.removeChild(iframeSync)
                }

                iframeSync.onerror = function () {
                  callback()
                  document.body.removeChild(iframeSync)
                }

                iframeSync.src = bidderItem.url
                document.body.appendChild(iframeSync)
                callback() // onload, onerror - might not be called cors,csp, async
              }
            },

            // handle each of the bidders through their corresponding callback URL
            biddersHandler: function (bidderItems, allItemsLoadedCallback) {
              var loadedCount = 0

              function checkCompletion() {
                loadedCount++

                if (loadedCount === bidderItems.length) {
                  allItemsLoadedCallback()
                }
              }
              for (var i = 0; i < bidderItems.length; i++) {
                this.loadSyncItem(bidderItems[i], checkCompletion)
              }
            },

            processQueuedAds: function () {
              for (var x = 0; x < queueAds.length; x++) {
                sevioads.loadingRequest(queueAds[x])
              }
            },

            // Main Ads rendering routine
            // Main Ads rendering routine
            renderAds: function (response) {
              var objKeys = Object.keys(response.winningBidsByTagId)
              for (var i = 0; i < objKeys.length; i++) {
                var adData = response.winningBidsByTagId[objKeys[i]]

                this.associateViewableIdToZone({
                  zoneId: objKeys[i],
                  viewableURL: adData.viewableURL,
                })
                var adPlaceholder = document.querySelector('[data-zone="' + objKeys[i] + '"]')

                // Native handling
                var adRenderParams = this.getParamsById(objKeys[i])
                if (adRenderParams.adType === 'native') {
                  var adDataDecoded = decodeURIComponent(adData.adm)
                  var adDecoded = JSON.parse(adDataDecoded)
                  var defaultVarsUrl = adDecoded.link.ext.defaults

                  var htmlNativeTemplateUrl = adDecoded.link.ext.template
                  var nativeLanding = {
                    name: 'clickURL',
                    type: 'TEXT',
                    value: adDecoded.link.url,
                  }

                  sevioads.loadServerUrl({
                    // read the default variables
                    serverUrl: defaultVarsUrl,
                    cFunction: function (cdnDefResponse) {
                      if (
                        cdnDefResponse.xhttp.readyState === 4 &&
                        cdnDefResponse.xhttp.status === 200
                      ) {
                        var defaultItemVars = JSON.parse(cdnDefResponse.xhttp.responseText)
                        var formattedValues = sevioads.formatUsingDefaultValues({
                          defaultItemVars,
                          assets: cdnDefResponse.settings.assets,
                        })

                        formattedValues.push(cdnDefResponse.settings.nativeLanding)

                        sevioads.loadServerUrl({
                          // read the template
                          serverUrl: cdnDefResponse.settings.htmlNativeTemplateUrl,
                          cFunction: function (htmlResponse) {
                            if (
                              htmlResponse.xhttp.readyState === 4 &&
                              htmlResponse.xhttp.status === 200
                            ) {
                              var htmlNativeTemplate = htmlResponse.xhttp.responseText
                              var resNativeTemplate = sevioads.replaceNativeVars({
                                htmlNativeTemplate: htmlNativeTemplate,
                                formattedValues: formattedValues,
                              })
                              cdnDefResponse.settings.adPlaceholder.innerHTML = resNativeTemplate

                              // native ad render successfully
                              sevioads.loadServerUrl({
                                serverUrl:
                                  adData.impURL +
                                  '&detectorData=' +
                                  btoa(JSON.stringify(detectorData)),
                                cFunction: sevioads.onRender,
                                serverMethod: 'GET',
                                cType: 'text/html',
                                eventTrackerType: 1,
                                eventTrackers: adData.eventTrackers,
                              })
                              sevioads.markLoadedAd(objKeys[i])
                            }
                          },
                          serverMethod: 'GET',
                          cType: 'text/html',
                          settings: 'read-native-template',
                        })
                      }
                    },
                    serverMethod: 'GET',
                    cType: 'application/json',
                    settings: {
                      htmlNativeTemplateUrl: htmlNativeTemplateUrl,
                      adPlaceholder: adPlaceholder,
                      nativeLanding: nativeLanding,
                      assets: adDecoded.assets,
                    },
                  })

                  adPlaceholder.setAttribute('data-rendered', 'true')
                  if (adData.eventTrackers) {
                    adPlaceholder.setAttribute(
                      'data-event-trackers',
                      JSON.stringify(adData.eventTrackers)
                    )
                  }
                  observer.unobserve(adPlaceholder)
                  if (sevioDebugActive) {
                    console.log('ObserverDebugNative:', observer)
                  }
                  observer.observe(adPlaceholder)
                  continue
                }

                adPlaceholder.setAttribute('data-rendered', 'true')
                if (adData.eventTrackers) {
                  adPlaceholder.setAttribute(
                    'data-event-trackers',
                    JSON.stringify(adData.eventTrackers)
                  )
                }

                var tbAdDiv = document.createElement('div')
                tbAdDiv.id = 'sevio_iframe_markup_' + adData.width + 'x' + adData.height
                tbAdDiv.setAttribute('data-rendered', 'true')

                try {
                  if (adData.render === 'r') {
                    doNotRefresh.push(objKeys[i]) // adsense
                    adPlaceholder.setAttribute(
                      'style',
                      'display: inline-block; width: inherit; height: inherit;'
                    )
                    tbAdDiv.setAttribute(
                      'style',
                      'display: inline-block; width: inherit; height: inherit;'
                    )
                    sevioads.loadServerUrl({
                      serverUrl: adData.admURL,
                      cFunction: function (cdnScript) {
                        if (cdnScript.xhttp.readyState === 4 && cdnScript.xhttp.status === 200) {
                          var scriptContent =
                            'var adContainer = (function() { ' +
                            cdnScript.xhttp.responseText +
                            '  return container; })();'
                          try {
                            eval.call(tbAdDiv, scriptContent)
                          } catch (e) {
                            console.log('Error on external script execution.')
                          }
                          if (typeof adContainer !== 'undefined') {
                            tbAdDiv.appendChild(adContainer)
                          }
                        }
                      },
                      serverMethod: 'GET',
                      cType: 'application/json',
                      settings: {},
                    })
                  } else {
                    adPlaceholder.setAttribute(
                      'style',
                      'max-width:' +
                        adData.width +
                        'px; width:' +
                        adData.width +
                        'px; height:' +
                        adData.height +
                        'px; display: inline-block;'
                    )
                    tbAdDiv.setAttribute(
                      'style',
                      'max-width: ' +
                        adData.width +
                        'px; width:' +
                        adData.width +
                        'px; height:' +
                        adData.height +
                        'px; display: inline-block;'
                    )
                    // Iframe ad setup
                    var iFrame = document.createElement('iframe')
                    if (adData.admURL) {
                      iFrame.src = adData.admURL
                    }
                    iFrame.setAttribute('scrolling', 'no')
                    iFrame.setAttribute(
                      'style',
                      'border: 0; overflow: hidden; margin:0 auto; width: 100%; max-width: ' +
                        adData.width +
                        ';height: 100%; max-height: ' +
                        adData.height +
                        ';'
                    )
                    iFrame.setAttribute('frameborder', '0')
                    iFrame.setAttribute('allowtransparency', 'true')
                    tbAdDiv.appendChild(iFrame)
                  }
                } catch (e) {
                  console.log('Error during ad rendering:', e)
                }

                adPlaceholder.appendChild(tbAdDiv)
                if (adData.eventTrackers) {
                  adPlaceholder.setAttribute(
                    'data-event-trackers',
                    JSON.stringify(adData.eventTrackers)
                  )
                }
                observer.unobserve(adPlaceholder)
                if (sevioDebugActive) console.log('ObserverDebug:', observer)
                observer.observe(adPlaceholder) // observe the ad element

                // Debugging header zone impURL
                var adZoneDebug = adPlaceholder.getAttribute('data-zone')
                if (adZoneDebug === '5d0ad807-f974-4620-9068-b06a6cab5680') {
                  // console.log(adZoneDebug);
                  // console.log(adData);
                  // console.log("InViewport:", sevioads.isAdInViewport(adZoneDebug));
                  var debugZoneInViewport = sevioads.isAdInViewport(adZoneDebug)
                  if (debugZoneInViewport) {
                    fetch('https://request.adx.ws/d', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        type: 'AD_INITIALLY_HIDDEN',
                        state: false,
                      }),
                    })
                  } else {
                    fetch('https://request.adx.ws/d', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        type: 'AD_INITIALLY_HIDDEN',
                        state: true,
                      }),
                    })
                  }
                } // end debug Header zone impURL

                // if (
                //   (document.location.hostname.endsWith('.marketcapof.com') ||
                //     document.location.hostname === 'marketcapof.com' ||
                //     document.location.hostname === 'coindoo.com' ||
                //     document.location.hostname === 'localhost') &&
                //   (adZoneDebug === '5d0ad807-f974-4620-9068-b06a6cab5680' ||
                //     adZoneDebug === '843876e3-4bf5-4fb8-8a9d-4b99f9047a79')
                // ) {
                //   impCnt = impCnt + 1;
                //   hugeNumber1.innerHTML = impCnt;
                // }

                // ad render successfully
                sevioads.loadServerUrl({
                  serverUrl: adData.impURL + '&detectorData=' + btoa(JSON.stringify(detectorData)),
                  cFunction: sevioads.onRender,
                  serverMethod: 'GET',
                  cType: 'text/html',
                  eventTrackerType: 1,
                  eventTrackers: adData.eventTrackers,
                })
                sevioads.markLoadedAd(objKeys[i]) // mark banner ad as loaded
              }
            },
            markLoadedAd: function (adData) {
              window.sevioadsData.map(function (adItem) {
                if (adItem.zone === adData) {
                  adItem.loaded = true
                }
                return adItem
              })
            },
            clearZoneViewKeys: function () {
              // cleanup keys for the zoneView_ - zone view flags
              Object.keys(localStorage).forEach(function (key) {
                if (key.indexOf('zoneView_') === 0) {
                  localStorage.removeItem(key)
                }
              })
            },
            onUrlChange: function () {
              console.log('Called onUrlChange')
              // API to execute on URL change
              sevioads.clearZoneViewKeys()
            },
            associateViewableIdToZone: function (props) {
              try {
                var zoneId = props.zoneId
                var viewableURL = props.viewableURL
                if (sevioadsData.length) {
                  for (var i = 0; i < sevioadsData.length; i++) {
                    if (sevioadsData[i].zone === zoneId) sevioadsData[i].viewableURL = viewableURL
                  }
                }
              } catch (e) {
                console.log('Error: ', e)
              }
            },
            refresh: function () {
              cookieSynced = false
            },
            onRender: function (gParams) {
              if (gParams.xhttp.readyState === 4 && gParams.xhttp.status === 200) {
                try {
                } catch (e) {
                  // no action needed for now on render callback
                  console.log('Error onRender:' + e)
                }
              }
            },
            // Get zone specific parameters
            getZoneRefreshParam: function (adDataZone, lookupParam) {
              var storeData = JSON.parse(localStorage.getItem('rZoneTB_' + adDataZone))

              return storeData !== null ? storeData[lookupParam] : null
            },
            // Native default values used - making sure we have values
            formatUsingDefaultValues: function ({ defaultItemVars, assets }) {
              if (defaultItemVars.length) {
                for (var i = 0; i < defaultItemVars.length; i++) {
                  for (var j = 0; j < assets.length; j++) {
                    if (defaultItemVars[i].name === assets[j].name && assets[j].value !== null) {
                      defaultItemVars[i] = assets[j]
                    }
                  }
                }
              }
              return defaultItemVars
            },
            // Perform replacements within the native template
            replaceNativeVars: function (replElements) {
              var formattedValues = replElements.formattedValues
              var htmlNativeTemplate = replElements.htmlNativeTemplate

              var regex = /"?\[%([^%]+)%\]"?/g

              var replTemplate = htmlNativeTemplate.replace(regex, function (match, p1) {
                for (var i = 0; i < formattedValues.length; i++) {
                  if (formattedValues[i].name === p1) {
                    if (match[0] === '[' && match[match.length - 1] === ']') {
                      return formattedValues[i].value
                    } else {
                      // Preserve the quotes around the attribute
                      return match[0] + formattedValues[i].value + match[match.length - 1]
                    }
                  }
                }
                return match
              })

              return replTemplate
            },
            startCountDown: function (zoneId, remainingTime, refreshRate) {
              var counterZoneKey = 'counterZoneTB_' + zoneId
              var refreshMaxTimes = sevioads.getZoneRefreshParam(zoneId, 'refreshMaxTimes')
              var refreshCounterInterval = sevioads.getZoneRefreshParam(
                zoneId,
                'refreshCounterInterval'
              )

              // console.log("refreshMaxTimes:", refreshMaxTimes);
              // console.log("refreshCounterInterval:", refreshCounterInterval);
              // console.log('Executing startCountDown')

              var keyStart = 'initialStartTime_TB_AD_' + zoneId
              var existingValue = localStorage.getItem(keyStart)
              if (existingValue !== null) {
                var timeStampZone = parseInt(existingValue)
                var intervalDiff = (Date.now() - timeStampZone) / 1000

                // Applying interval difference
                if (intervalDiff >= refreshCounterInterval) {
                  localStorage.setItem(counterZoneKey, 0)
                  localStorage.setItem(keyStart, Date.now())
                  sevioads.clearZoneViewKeys()
                }
              }

              clearTimeout(existingTimeoutRT)
              var existingTimeoutRT = setTimeout(function () {
                remainingTime--

                var counterZoneLS = localStorage.getItem(counterZoneKey)
                var counterZone = counterZoneLS === null ? 0 : parseInt(counterZoneLS)
                var updatingCounterLS = 'updatingState_' + zoneId
                var updatingCounterState = localStorage.getItem(updatingCounterLS)

                //   console.log('RemainingTime:', remainingTime);
                //   console.log('COUNTERZONE_BEFORE:', counterZone);

                if (remainingTime === 0) {
                  if (counterZone < refreshMaxTimes && updatingCounterState !== '1') {
                    localStorage.setItem(updatingCounterLS, '1')

                    counterZone = counterZone + 1
                    clearTimeout(clearUpdate)
                    var clearUpdate = setTimeout(function () {
                      localStorage.setItem(updatingCounterLS, '0')
                    }, 1000)
                    localStorage.setItem(counterZoneKey, counterZone.toString())
                  }

                  remainingTime = Number(refreshRate)
                }

                // Update the remaining time in localStorage
                localStorage.setItem(`remainingTime_${zoneId}`, remainingTime)

                var zStatus = localStorage.getItem('zoneTStatus_' + zoneId)

                if (zStatus === 'started') {
                  sevioads.startCountDown(zoneId, Number(remainingTime), Number(refreshRate))
                }
              }, 1000) // Update every second
            },
            fetchServerData: function (sParams) {
              if (sParams.xhttp.readyState === 4 && sParams.xhttp.status === 200) {
                // success callback - Populate the items with the data from the backend
                try {
                  var jsonResponse = JSON.parse(sParams.xhttp.responseText)
                  doNotRefresh = []
                  if (sParams.settings === 'refresh') {
                    // clear zoneView_*
                    sevioads.clearZoneViewKeys()
                    sevioads.reRenderAds(jsonResponse)
                  } else {
                    sevioads.renderAds(jsonResponse)
                  }
                } catch (e) {
                  console.log('Error loading ad' + e)
                }
              }
            },
            getNonce: function () {
              return Math.floor(Math.random() * 1000000000000) + new Date().getTime()
            },

            loadingRequest: function (loadingProps) {
              var foundAds = loadingProps.foundAds
              var requestData = { ads: [] }

              foundAds.forEach(function (myElement) {
                var requestDataAdElement = {}
                var adZone = myElement.getAttribute('data-zone')
                var zoneParams = sevioads.getParamsById(adZone)

                requestDataAdElement.type = zoneParams.adType.toUpperCase()
                var keyStart = 'initialStartTime_TB_AD_' + adZone
                var existingValue = localStorage.getItem(keyStart)
                if (existingValue === null) {
                  var currentTime = Date.now()
                  localStorage.setItem(keyStart, currentTime)
                }

                requestDataAdElement.tagId = adZone

                if (sevioDebugActive) console.log('AdParams:', zoneParams)

                var cdnPath =
                  CDN_SERVER +
                  '/' +
                  zoneParams.accountId +
                  '/inventories/' +
                  zoneParams.inventoryId +
                  '.json'
                if (
                  zoneParams.hasOwnProperty('inventoryId') &&
                  zoneParams.hasOwnProperty('accountId') &&
                  !(remoteParamUrls.indexOf(cdnPath) !== -1)
                ) {
                  remoteParamUrls.push(cdnPath)
                }

                if (
                  zoneParams.adType.toLowerCase() === 'banner' &&
                  zoneParams.width &&
                  zoneParams.height
                ) {
                  requestDataAdElement.sizes = [
                    {
                      width: zoneParams.width,
                      height: zoneParams.height,
                    },
                  ]
                }
                var adSizes = document.querySelector('[data-zone="' + zoneParams.zone + '"]')
                requestDataAdElement.maxSize = {
                  width: adSizes.parentNode.offsetWidth,
                  height: adSizes.parentNode.offsetHeight,
                }

                var isAdFound = requestData.ads.some(function (element) {
                  return element.tagId === zoneParams.zone
                })
                if (!isAdFound) {
                  // do not load dups
                  requestData.ads.push(requestDataAdElement)
                }
              })

              if (sevioDebugActive) {
                console.log('RequestDATA:', requestData)
              }

              requestData.privacy = cmpData

              // Format the data and pass it in one single request to fetch the ads
              var nonce = sevioads.getNonce()

              if (requestData.ads.length > 0) {
                sevioads.loadServerUrl({
                  serverUrl:
                    AD_SERVER_URL +
                    '?t=' +
                    Date.now() +
                    '&detectorData=' +
                    btoa(JSON.stringify(detectorData)),
                  cFunction: sevioads.fetchServerData,
                  serverMethod: 'POST',
                  cType: 'application/json',
                  xNonce: nonce,
                  data: JSON.stringify(requestData),
                })

                if (localStorage.getItem('prereqRefresh') === null) {
                  // set reference to know when the ad was first rendered
                  localStorage.setItem('prereqRefresh', 1)
                  sevioads.prereqRefresh()
                }
              }
            },
            fetchJsonParams: function (sParams) {
              if (sParams.xhttp.readyState === 4 && sParams.xhttp.status === 200) {
                // success callback - Populate the items with the data from the backend
                try {
                  // console.log('CLEAR remainingTime')
                  for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i)
                    if (key.startsWith('zoneView_') || key.startsWith('remainingTime_')) {
                      localStorage.removeItem(key)
                    }
                    if (key.startsWith('zoneTStatus_')) {
                      localStorage.setItem(key, 'stopped')
                    }
                  }

                  var jsonResponse = JSON.parse(sParams.xhttp.response)
                  var zoneItems = Object.keys(jsonResponse)

                  for (var i = 0; i < zoneItems.length; i++) {
                    localStorage.setItem(
                      'rZoneTB_' + zoneItems[i],
                      JSON.stringify(jsonResponse[zoneItems[i]])
                    )

                    if (sevioads.getParamsById(zoneItems[i])) {
                      var refreshKey =
                        'rRate_' +
                        jsonResponse[zoneItems[i]].refreshRate +
                        '_rMaxTimes_' +
                        jsonResponse[zoneItems[i]].refreshMaxTimes +
                        '_rCounterInterval_' +
                        jsonResponse[zoneItems[i]].refreshCounterInterval
                      if (groupedRefresh.hasOwnProperty(refreshKey)) {
                        groupedRefresh[refreshKey].zones.push(zoneItems[i])
                      } else {
                        groupedRefresh[refreshKey] = {
                          refreshParams: jsonResponse[zoneItems[i]],
                          zones: [zoneItems[i]],
                        }
                      }
                    }
                  }
                  sParams.settings()
                } catch (e) {
                  console.log('Error parsing remote params' + e)
                }
              }
            },
            isAdInViewport: function (zone) {
              var adElement = document.querySelector('[data-zone="' + zone + '"]')
              if (!adElement) {
                return false
              }

              var adRect = adElement.getBoundingClientRect()
              var adTop = adRect.top
              var adBottom = adRect.bottom
              var adLeft = adRect.left
              var adRight = adRect.right
              var windowHeight = window.innerHeight || document.documentElement.clientHeight
              var windowWidth = window.innerWidth || document.documentElement.clientWidth

              return (
                adBottom > 0.5 * adRect.height &&
                adTop < windowHeight - 0.5 * adRect.height &&
                adRight > 0 &&
                adLeft < windowWidth
              )
            },
            prereqRefresh: function () {
              // read remote params for each inventory and group items with similar refresh params
              if (remoteParamUrls.length) {
                var completedRequests = 0

                function checkAndResolve() {
                  completedRequests++
                  if (completedRequests === remoteParamUrls.length) {
                    sevioads.initRefresh()
                  }
                }

                var nonce = sevioads.getNonce()

                for (var i = 0; i < remoteParamUrls.length; i++) {
                  sevioads.loadServerUrl({
                    serverUrl: remoteParamUrls[i],
                    cFunction: function () {
                      sevioads.fetchJsonParams.apply(this, arguments)
                      checkAndResolve()
                    },
                    serverMethod: 'GET',
                    cType: 'application/json',
                    xNonce: nonce,
                    settings: function () {},
                  })
                }
              }
            },
            reRenderAds: function (response) {
              var objRespKeys = Object.keys(response.winningBidsByTagId)
              for (var i = 0; i < objRespKeys.length; i++) {
                var adPlaceholder = document.querySelector('[data-zone="' + objRespKeys[i] + '"]')
                if (adPlaceholder) {
                  adPlaceholder.innerHTML = ''
                }
              }
              sevioads.renderAds(response)
            },
            initRefresh: function () {
              // check the refresh rates and start the refreshing logic, write initial data in localStorage
              var refreshStore = localStorage.getItem(tbStoreKey)
              var refreshStoreJson = JSON.parse(refreshStore)

              var cloneGrouped = Object.assign({}, groupedRefresh)
              var refreshKeys = Object.keys(cloneGrouped)

              for (var i = 0; i < refreshKeys.length; i++) {
                if (
                  refreshStoreJson &&
                  refreshStoreJson[refreshKeys[i]] &&
                  refreshStoreJson[refreshKeys[i]].initializedTime
                ) {
                  cloneGrouped[refreshKeys[i]].initializedTime =
                    refreshStoreJson[refreshKeys[i]].initializedTime
                  cloneGrouped[refreshKeys[i]].refreshCount =
                    refreshStoreJson[refreshKeys[i]].refreshCount
                } else {
                  cloneGrouped[refreshKeys[i]].initializedTime = Date.now()
                }
              }

              setTimeout(function () {
                localStorage.setItem(tbStoreKey, JSON.stringify(cloneGrouped))
                sevioads.refreshIntervalChecker()
              }, 1000)
            },

            // Checks every second the available items that need to be refreshed
            refreshIntervalChecker: function () {
              refreshTimerInitialized = true
              var toRefresh = []
              var allKeys = Object.keys(localStorage)
              var pattern = /^remainingTime_/ // lookup the remainingTime_ items in the localStorage

              for (var i = 0; i < allKeys.length; i++) {
                var key = allKeys[i]
                if (pattern.test(key)) {
                  var value = localStorage.getItem(key)
                  if (value === '1') {
                    var zKey = key.replace('remainingTime_', '')
                    var currCount = parseInt(localStorage.getItem('counterZoneTB_' + zKey))
                    var refreshMaxTimes = sevioads.getZoneRefreshParam(zKey, 'refreshMaxTimes')

                    currCount = isNaN(currCount) ? 0 : parseInt(currCount)
                    if (currCount < refreshMaxTimes) {
                      toRefresh.push(zKey)
                    }
                  }
                }
              }
              // RefreshingADS routine
              if (toRefresh.length > 0) {
                sevioads.refreshFormatRequest(toRefresh)
              }

              clearTimeout(existingTimeout)
              var existingTimeout = setTimeout(function () {
                sevioads.refreshIntervalChecker()
              }, 1000)
            },
            getParamsById: function (elZone) {
              var paramsFound = window.sevioadsData.filter(function (obj) {
                return obj.zone === elZone
              })[0]
              return paramsFound
            },
            // Read new ads from the Ad server
            refreshFormatRequest: function (rData) {
              var requestDataRefresh = { ads: [] }

              for (var i = 0; i < rData.length; i++) {
                var reqDataAdItemRefresh = {}
                var refreshAdParams = this.getParamsById(rData[i])
                reqDataAdItemRefresh.type = refreshAdParams.adType.toUpperCase()

                reqDataAdItemRefresh.tagId = refreshAdParams.zone
                if (
                  refreshAdParams.adType.toLowerCase() === 'banner' &&
                  refreshAdParams.width &&
                  refreshAdParams.height
                ) {
                  requestDataAdElement.sizes = [
                    {
                      width: refreshAdParams.width,
                      height: refreshAdParams.height,
                    },
                  ]
                }

                var adSizesRefresh = document.querySelector(
                  '[data-zone="' + refreshAdParams.zone + '"]'
                )
                reqDataAdItemRefresh.maxSize = {
                  width: adSizesRefresh.parentNode.offsetWidth,
                  height: adSizesRefresh.parentNode.offsetHeight,
                }

                if (sevioads.isAdInViewport(refreshAdParams.zone)) {
                  requestDataRefresh.ads.push(reqDataAdItemRefresh)
                }
                // Sizes can be optional but FE logic for this can remain as user might specify these also as params
              }

              // if there is an adsense ad in the array we do not refresh it
              requestDataRefresh.ads = requestDataRefresh.ads.filter(function (ad) {
                return doNotRefresh.indexOf(ad.tagId) === -1
              })

              if (requestDataRefresh.ads.length > 0) {
                var nonce = sevioads.getNonce()

                requestDataRefresh.privacy = cmpData

                sevioads.loadServerUrl({
                  serverUrl:
                    AD_SERVER_URL +
                    '?t=' +
                    Date.now() +
                    '&refresh=true' +
                    '&detectorData=' +
                    btoa(JSON.stringify(detectorData)),
                  cFunction: sevioads.fetchServerData,
                  serverMethod: 'POST',
                  cType: 'application/json',
                  xNonce: nonce,
                  data: JSON.stringify(requestDataRefresh),
                  settings: 'refresh',
                })
              }
            },
            loadServerUrl: function (loadParams) {
              var xhttp = new XMLHttpRequest()
              xhttp.onload = function () {
                loadParams.cFunction({
                  xhttp: this,
                  data: loadParams.data,
                  settings: loadParams.settings,
                })
              }
              xhttp.open(loadParams.serverMethod, loadParams.serverUrl)
              if (loadParams.cType) {
                xhttp.setRequestHeader('Content-Type', loadParams.cType)
              }
              if (loadParams.xNonce) {
                xhttp.setRequestHeader('X-Nonce', loadParams.xNonce)
              }

              if (loadParams.eventTrackers && loadParams.eventTrackers.length > 0) {
                var filteredEventTrackers = loadParams.eventTrackers.filter(function (et) {
                  return et.type === loadParams.eventTrackerType
                })

                if (filteredEventTrackers.length > 0) {
                  for (var index = 0; index < filteredEventTrackers.length; index++) {
                    xhttp.setRequestHeader(
                      'TB-Event-Tracker' + index,
                      filteredEventTrackers[index].url
                    )
                  }
                }
              }

              if (loadParams.data) {
                xhttp.send(loadParams.data)
              } else {
                xhttp.send()
              }
            },

            onHideDocument: function () {
              for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i)
                if (key.startsWith('zoneTStatus_')) {
                  var adPlaceholder = document.querySelector(
                    '[data-zone="' + key.replace('zoneTStatus_', '') + '"]'
                  )
                  if (adPlaceholder) {
                    observer.unobserve(adPlaceholder)
                  }
                  localStorage.setItem(key, 'stopped')
                }
              }
            },
            onDocumentVisible: function () {
              for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i)
                if (key.startsWith('zoneTStatus_')) {
                  var adPlaceholder = document.querySelector(
                    '[data-zone="' + key.replace('zoneTStatus_', '') + '"]'
                  )
                  if (adPlaceholder) {
                    observer.observe(adPlaceholder)
                  }
                }
              }
            },
            getViewableURLforZONE: function (adZone) {
              var foundViewableURL = ''
              if (sevioadsData.length) {
                for (var i = 0; i < sevioadsData.length; i++) {
                  if (sevioadsData[i].zone === adZone) {
                    foundViewableURL = sevioadsData[i].viewableURL
                  }
                }
              }
              return foundViewableURL
            },
            adInViewport: function (adItem) {
              setTimeout(function () {
                // reset the flag for tree detection change after 1s
                treeChangeDetected = false
              }, 1000)
              var adZn = adItem.getAttribute('data-zone')

              if (sevioDebugActive) {
                console.log('EXECUTING -> AD IN VIEWPORT ROUTINE')
              }

              var viewableLink = this.getViewableURLforZONE(adZn)

              if (sevioDebugActive) {
                console.log('ViewableLINK:', viewableLink)
              }
              var adDataZone = adItem.getAttribute('data-zone')
              var lsAdDataZone = 'zoneView_' + adDataZone
              // console.log('AD IN VIEWPORT:', adDataZone);

              var isFoundExternal = doNotRefresh.indexOf(adZn) !== -1

              if (isFoundExternal) {
                localStorage.setItem('zoneTStatus_' + adDataZone, 'stopped')
              } else {
                localStorage.setItem('zoneTStatus_' + adDataZone, 'started')
              }

              if (localStorage.getItem(lsAdDataZone) === null) {
                var eventTrackers = JSON.parse(adItem.getAttribute('data-event-trackers'))

                var targetInViewport = sevioads.isAdInViewport(adZn)
                // Debugging on viewable
                if (adZn === '5d0ad807-f974-4620-9068-b06a6cab5680') {
                  if (targetInViewport) {
                    fetch('https://request.adx.ws/d', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        type: 'AD_HIDDEN_BEFORE_EVENT',
                        state: false,
                      }),
                    })
                  } else {
                    fetch('https://request.adx.ws/d', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        type: 'AD_HIDDEN_BEFORE_EVENT',
                        state: true,
                      }),
                    })
                  }
                }

                // end Debugging on viewable
                if (!targetInViewport) return

                sevioads.loadServerUrl({
                  serverUrl: viewableLink + '&detectorData=' + btoa(JSON.stringify(detectorData)),
                  cFunction: function () {
                    // if (
                    //   (document.location.hostname.endsWith(
                    //     '.marketcapof.com'
                    //   ) ||
                    //     document.location.hostname === 'marketcapof.com' ||
                    //     document.location.hostname === 'coindoo.com' ||
                    //     document.location.hostname === 'localhost') &&
                    //   (adZn === '5d0ad807-f974-4620-9068-b06a6cab5680' ||
                    //     adZn === '843876e3-4bf5-4fb8-8a9d-4b99f9047a79')
                    // ) {
                    //   viewableCnt = viewableCnt + 1;
                    //   hugeNumber2.innerHTML = viewableCnt;
                    // }
                    // set reference to know when the ad was first rendered
                    localStorage.setItem(lsAdDataZone, 1)
                  },
                  serverMethod: 'GET',
                  cType: 'text/html',
                  eventTrackerType: 2,
                  eventTrackers: eventTrackers,
                })
              }

              // need to get the default refreshRate for the corresponding zone in here and replace the 30
              var zoneRefreshRate = sevioads.getZoneRefreshParam(adDataZone, 'refreshRate')
              var refreshMaxTimes = sevioads.getZoneRefreshParam(adDataZone, 'refreshMaxTimes')
              if (sevioDebugActive) {
                console.log(
                  'RefreshRate:' +
                    zoneRefreshRate +
                    ' -> refreshMaxTimes:' +
                    refreshMaxTimes +
                    ' -> Zona: ' +
                    adDataZone
                )
              }

              var remainingTime = localStorage.getItem('remainingTime_' + adDataZone)
              if (zoneRefreshRate !== null && refreshMaxTimes !== null) {
                sevioads.startCountDown(
                  adDataZone,
                  Number(remainingTime ? remainingTime : zoneRefreshRate),
                  Number(zoneRefreshRate)
                )
              }
            },
          }

          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                var isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.5
                if (sevioDebugActive) {
                  console.log('Entries:', entries)
                  console.log('OBSERVER initialized')
                }

                if (isIntersecting) {
                  // ad element is at least 50% visible on the screen
                  // If the ad is still visible after 1 second re-check if the ad is in the viewport
                  setTimeout(function () {
                    if (isIntersecting) {
                      if (!document.hidden) {
                        var computedStyle = window.getComputedStyle(entry.target)
                        var visibilityStyle = computedStyle.getPropertyValue('visibility')

                        if (visibilityStyle === 'visible') {
                          if (sevioDebugActive) {
                            console.log('Ad in viewport', entry.target.getAttribute('data-zone'))
                            console.log('Intersection ratio:', entry.intersectionRatio)
                          }

                          sevioads.adInViewport(entry.target)
                        }
                      }
                    }
                  }, 1000)
                } else {
                  // Ad no longer in viewport
                  var adDataZone = entry.target.getAttribute('data-zone')

                  setTimeout(function () {
                    if (sevioDebugActive) {
                      console.log('Intersection ratio OUTofViewport:', entry.intersectionRatio)
                      console.log('Ad not in viewport:', adDataZone)
                    }
                    localStorage.setItem('zoneTStatus_' + adDataZone, 'stopped')
                  }, 1000)
                }
              })
            },
            { threshold: 0.5 }
          )

          var loadBannerAd = function (args) {
            this.construct(args)
          }

          loadBannerAd.prototype.construct = function (props) {
            this.props = props // Store the props in the instance
          }

          if (typeof window.sevioads !== 'undefined') {
            for (var i = 0; i < window.sevioads.length; i++) {
              sevioads.push(window.sevioads[i])
            }
          }

          // Start refresh per session
          setTimeout(() => {
            if (!refreshTimerInitialized) {
              sevioads.refreshIntervalChecker()
            }
          }, 1500)

          // Browser switch to new tab
          function handleVisibilityChange() {
            if (document.hidden) {
              sevioads.onHideDocument() // stop all statuses when document looses visibility
            } else {
              sevioads.onDocumentVisible()
            }
          }
          document.addEventListener('visibilitychange', handleVisibilityChange)

          /**
           * Detect changes in styles - used for ads rendered in dropdowns - that are not initially visible
           * @param {*} mutationsList
           */
          function handleStyleChanges(mutationsList) {
            mutationsList.forEach(function (mutation) {
              var sevioadsElements = mutation.target.querySelectorAll('.sevioads')

              // Iterate through the NodeList and detect visibility changes
              sevioadsElements.forEach(function (sevioadsElement) {
                var computedStyle = window.getComputedStyle(sevioadsElement)
                var visibilityStyle = computedStyle.getPropertyValue('visibility')
                var displayStyle = computedStyle.getPropertyValue('display')
                var opacityValue = computedStyle.getPropertyValue('opacity')

                if (
                  visibilityStyle === 'hidden' &&
                  displayStyle === 'block' &&
                  parseInt(opacityValue) === 1
                ) {
                  if (sevioDebugActive) {
                    console.log(
                      'Child Element with class "sevioads" is visible and has changed display:',
                      sevioadsElement
                    )
                  }

                  if (!treeChangeDetected && initialPath === window.location.pathname) {
                    sevioads.adInViewport(sevioadsElement)
                    treeChangeDetected = true
                  }
                }
              })
            })
          }

          // Create a Mutation Observer to watch for style changes in the DOM
          var rootElement = document.documentElement
          var mutationObserver = new MutationObserver(handleStyleChanges)

          // Start observing the root element for changes in style-related attributes
          mutationObserver.observe(rootElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class'],
          })

          sevioads.clearZoneViewKeys()

          return sevioads
        })()
        // END - main sevioads iffe
      }
    }
  }

  // - Deal with visibility changes
  function handleBeforeUnload() {
    localStorage.removeItem('refreshTB')
    localStorage.removeItem('refreshStoreTB')

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('zoneView_')) {
        // Delete the key
        localStorage.removeItem(key)
      }
    })

    // Remove the event listener to ensure it's executed only once
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }

  // Add the event listener for beforeunload
  window.addEventListener('beforeunload', function (event) {
    setTimeout(handleBeforeUnload, 0)
  })

  window.addEventListener('load', function () {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i)
      if (key.indexOf('remainingTime_') === 0) {
        localStorage.removeItem(key)
      }
    }
  })
})()
