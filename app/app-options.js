
var mgmApp = angular.module('mgmApp',
    ['ngAnimate', 'ngTouch', 'ui.router', 'famous.angular'])


    .factory('opt', function () {
        // remember: factory returns Singleton !
        var opt = {
            appSize: [window.innerWidth, window.innerHeight],
            appDevice: "default",
            countLoadingAnimation: 0,
            layout: {},
            deviceConfigs: {
                // Configs for different devices / screen resolutions...
                // will be copied to "opt.layout." triggered by events like resizing etc.
                smallPhonePortrait: {
                    layout: {
                        fontSizeBase: 20,
                        headerHeight: 40,
                        footerHeight: 40,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                smallPhoneLandscape: {
                    layout: {
                        fontSizeBase: 20,
                        headerHeight: 30,
                        footerHeight: 30,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                phabletPhonePortrait: {
                    layout: {
                        fontSizeBase: 20,
                        headerHeight: 30,
                        footerHeight: 30,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                phabletPhoneLandscape: {
                    layout: {
                        fontSizeBase: 14,
                        headerHeight: 25,
                        footerHeight: 25,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                tabletPortrait: {
                    layout: {
                        fontSizeBase: 20,
                        headerHeight: 30,
                        footerHeight: 30,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                tabletLandscape: {
                    layout: {
                        fontSizeBase: 20,
                        headerHeight: 30,
                        footerHeight: 30,
                        grid: 12,
                        margins: [10,10,10,10],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                },
                desktopXL: {
                    layout: {
                        fontSizeBase: 14,
                        headerHeight: 25,
                        footerHeight: 25,
                        grid: 12,
                        margins: [10,200,10,200],
                        gutter: [10,10],
                        quarterWidth: undefined,
                        quarterHeight: undefined,
                        sixthHeight: undefined
                    }
                }
            },

            nGridWidth: function (frag){
                // get width (px) of a 1/frag of the screen width (frag=4 means 1/4 width etc.) - considering margins and gutters!
                return (
                    (this.appSize[0]-this.layout.margins[1]-this.layout.margins[3])
                        - this.layout.gutter[0]*(frag-1)
                    )/frag
            },
            nGridHeight: function (frag){
                // get height (px) of a 1/frag of the screen height (frag=3 means 1/3 height etc.) - considering margins and gutters!
                return (
                    (this.appSize[1]-this.layout.margins[0]-this.layout.margins[2]-this.layout.headerHeight-this.layout.footerHeight)
                        - this.layout.gutter[1]*(frag-1)
                    )/frag
            },
            gridWidth: function (){
                // get width (px) of one column - considering margins and gutters!
                return ((this.appSize[0]-this.layout.margins[1]-this.layout.margins[3]) - this.layout.gutter[0]*(this.layout.grid-1))/this.layout.grid
            },
            gridPosX: function (column){
                // get x-position (px) for n-th column (starting with column 0) - considering margins and gutters!
                return this.layout.margins[1] + (column)*this.gridWidth() + (column)*this.layout.gutter[0]
            }

        };



        opt.calculateLayout = function (){

            //
            var effectiveWidth = window.innerWidth * window.devicePixelRatio;
            var sX = screen.width;
            var sY = screen.height;
            var sRes = window.devicePixelRatio;
            var device = '';

            if ((sX==360 && sY==640)||(sX==640 && sY==360) && sRes==3) {device='Note3'};
            if (sX==1440 && sY==900 && sRes==2) {device='MacBookPro15'};


            if (window.innerWidth < window.innerHeight) {
                // Hochformat
                if (device=='Note3') {
                    opt.layout = opt.deviceConfigs.phabletPhonePortrait.layout;
                    opt.appDevice = "phabletPhonePortrait";
                }

            } else {
                // Querformat
                if (device=='Note3') {
                    opt.layout = opt.deviceConfigs.phabletPhoneLandscape.layout;
                    opt.appDevice = "phabletPhoneLandscape";
                }

            }

            if (device=='MacBookPro15' || device=='') {
                if (window.innerWidth > 960) {
                    opt.layout = opt.deviceConfigs.desktopXL.layout;
                    opt.appDevice = "desktopXL";
                }
                else {
                    opt.layout = opt.deviceConfigs.smallPhonePortrait.layout;
                    opt.appDevice = "smallPhonePortrait";
                    //this.layout.headerHeight = window.innerWidth*0.05;
                    //this.layout.fontSizeBase = window.innerWidth*0.029;
                }
            }


        };


        opt.gethalfWidth = function (){
            return this.layout.halfWidth
        };

        opt.browserVersion = function (){
            // based on http://jsfiddle.net/ChristianL/AVyND/
            var unknown = '-';

            // screen
            var screenSize = '';
            if (screen.width) {
                var width = (screen.width) ? screen.width : '';
                var height = (screen.height) ? screen.height : '';
                screenSize += '' + width + " x " + height;
            }

            // window
            var windowSize = '' + window.innerWidth + " x " + window.innerHeight;

            // pixel ratio
            var pixelRatio = window.devicePixelRatio;

            // browser
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var browser = navigator.appName;
            var version = '' + parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion, 10);
            var nameOffset, verOffset, ix;

            // Opera
            if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                browser = 'Opera';
                version = nAgt.substring(verOffset + 6);
                if ((verOffset = nAgt.indexOf('Version')) != -1) {
                    version = nAgt.substring(verOffset + 8);
                }
            }
            // MSIE
            else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                browser = 'Microsoft Internet Explorer';
                version = nAgt.substring(verOffset + 5);
            }
            // Chrome
            else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                browser = 'Chrome';
                version = nAgt.substring(verOffset + 7);
            }
            // Safari
            else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                browser = 'Safari';
                version = nAgt.substring(verOffset + 7);
                if ((verOffset = nAgt.indexOf('Version')) != -1) {
                    version = nAgt.substring(verOffset + 8);
                }
            }
            // Firefox
            else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                browser = 'Firefox';
                version = nAgt.substring(verOffset + 8);
            }
            // MSIE 11+
            else if (nAgt.indexOf('Trident/') != -1) {
                browser = 'Microsoft Internet Explorer';
                version = nAgt.substring(nAgt.indexOf('rv:') + 3);
            }
            // Other browsers
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                browser = nAgt.substring(nameOffset, verOffset);
                version = nAgt.substring(verOffset + 1);
                if (browser.toLowerCase() == browser.toUpperCase()) {
                    browser = navigator.appName;
                }
            }
            // trim the version string
            if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
            if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

            majorVersion = parseInt('' + version, 10);
            if (isNaN(majorVersion)) {
                version = '' + parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion, 10);
            }

            // mobile version
            var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

            // cookie
            var cookieEnabled = (navigator.cookieEnabled) ? true : false;

            if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
                document.cookie = 'testcookie';
                cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
            }

            // system
            var os = unknown;
            var clientStrings = [
                {s:'Windows 3.11', r:/Win16/},
                {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
                {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
                {s:'Windows 98', r:/(Windows 98|Win98)/},
                {s:'Windows CE', r:/Windows CE/},
                {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
                {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
                {s:'Windows Server 2003', r:/Windows NT 5.2/},
                {s:'Windows Vista', r:/Windows NT 6.0/},
                {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
                {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
                {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
                {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
                {s:'Windows ME', r:/Windows ME/},
                {s:'Android', r:/Android/},
                {s:'Open BSD', r:/OpenBSD/},
                {s:'Sun OS', r:/SunOS/},
                {s:'Linux', r:/(Linux|X11)/},
                {s:'iOS', r:/(iPhone|iPad|iPod)/},
                {s:'Mac OS X', r:/Mac OS X/},
                {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
                {s:'QNX', r:/QNX/},
                {s:'UNIX', r:/UNIX/},
                {s:'BeOS', r:/BeOS/},
                {s:'OS/2', r:/OS\/2/},
                {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
            ];
            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    os = cs.s;
                    break;
                }
            }

            var osVersion = unknown;

            if (/Windows/.test(os)) {
                osVersion = /Windows (.*)/.exec(os)[1];
                os = 'Windows';
            }

            switch (os) {
                case 'Mac OS X':
                    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                    break;

                case 'Android':
                    osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                    break;

                case 'iOS':
                    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                    break;
            }

            // flash (you'll need to include swfobject)
            /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
            var flashVersion = 'no check';
            if (typeof swfobject != 'undefined') {
                var fv = swfobject.getFlashPlayerVersion();
                if (fv.major > 0) {
                    flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
                }
                else  {
                    flashVersion = unknown;
                }
            }


            return {
                screen: screenSize,
                window: windowSize,
                pixelRatio: pixelRatio,
                browser: browser,
                browserVersion: version,
                mobile: mobile,
                os: os,
                osVersion: osVersion,
                cookies: cookieEnabled,
                flashVersion: flashVersion
            }
        };


        return opt;
    })

;


