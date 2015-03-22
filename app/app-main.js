'use strict';

angular.module('mgmApp')

    .controller('appCtrl', function ($scope, $state, $famous, opt) {


        Pace.once('hide', function(){
            document.querySelector('#paceStartCSS').remove();
        });

        $scope.opt = opt;
        opt.calculateLayout();

        $scope.configUpdate = function () {
            // Update app-size
            opt.appSize = [window.innerWidth, window.innerHeight];
            opt.calculateLayout();

            // Without $apply Famo.us doesn't recognize the change
            // Remember: opt is a factory (=singleton)
            // - this means that opt and $scope.opt are the SAME object!
            // - this is why the new .appWidth value is automatically available in the scope!
            $scope.$apply();

        };


        // here some plain vanilla famo.us code
        var Engine = $famous['famous/core/Engine'];
        var Transitionable = $famous['famous/transitions/Transitionable'];
        var Easing = $famous['famous/transitions/Easing'];
        var View = $famous['famous/core/View'];
        var Surface = $famous['famous/core/Surface'];
        var Transform = $famous['famous/core/Transform'];

        var StateModifier = $famous["famous/modifiers/StateModifier"];
        var ViewSequence = $famous["famous/core/ViewSequence"];
        var Timer = $famous["famous/utilities/Timer"];
        var FlexScrollView = famousflex.FlexScrollView;


        // SIMPLE DEMO

        //$scope.myFamousCode = new View();

        //var _surf = new Surface({properties: {backgroundColor: 'red'}});
        //_surf.setContent("I'm a surface");

        //$scope.myFamousCode.add(_surf);


        // FAMOUS FLEX DEMO



        $scope.myFamousCode = new View({
            size: [undefined, undefined]
        });

        var viewSequence = new ViewSequence();

        var scrollView = new FlexScrollView({
            layoutOptions: {
                // callback for "sticky" sections
                isSectionCallback: function(renderNode) {
                    return renderNode.properties.isSection;
                },
                margins: [0, 0, 0, 0]
            },
            dataSource: viewSequence,
            autoPipeEvents: true,
            alignment: 0,   // shifts down when inserting new items
            mouseMove: true,
            useContainer: true, // wraps scrollview inside a ContainerSurface
            debug: false
            //pullToRefreshHeader: pullToRefreshHeader
        });


        //
        // Adds item to the scrollview
        //

        var firstKey;
        var firstSection;
        var lastSection;
        var listPosition = 0;
        function _addScrollItem(data, top, key) {

            // Store first key
            firstKey = firstKey || key;
            if (top && key) {
                firstKey = key;
            }

            // Insert section
            if (!top && (data.category !== lastSection)) {
                lastSection = data.category;
                firstSection = firstSection || data.category;
                scrollView.push(_createSection(data.category));
                listPosition = listPosition + 1;
            } else if (top && (data.category !== firstSection)) {
                firstSection = data.category;
                scrollView.insert(0, _createSection(data.category));
                listPosition = listPosition + 1;
            }

            var element1 = _createElementHead(data);
            var element2 = _createElementContent(data);
            element1.pos = listPosition; listPosition = listPosition + 1;
            element1.surf = itemstorage.length;
            element2.pos = listPosition; listPosition = listPosition + 1;

            if (top) {
                scrollView.insert(1, element1);
            }
            else {
                scrollView.push(element1);
            }
            scrollView.push(element2);
            itemstorage.push(element2);

        }

        //
        // Create an element headline
        //
        function _createElementHead(data) {
            var surface = new Surface({
                size: [undefined, true],
                classes: ['element','header'],
                content: '<div class="back"><span class="headline">'+data.elementhead+'</span></div>',
                properties: {
                    message: data.content
                }
            });
            surface.on('click', function() {

            });
            return surface;
        }

        //
        // Create an element
        //
        function _createElementContent(data) {
            var surface = new Surface({
                size: [undefined, true],
                classes: ['element'],
                content: '<div class="back"><div class="content">'+data.elementcontent+'</div></div>',
                properties: {
                    message: data.content
                }
            });
            return surface;
        }



        //
        // Create a section
        //
        function _createSection(category) {
            return new Surface({
                size: [undefined, 24],
                classes: ['element-category'],
                content: '<span class="text">'+category+'</span>',
                properties: {
                    isSection: true
                }
            });
        }

        //
        // Create test data
        //
        var itemstorage = [];
        for (var i = 0; i < 20; i++) {

            _addScrollItem(
                {
                    elementhead: function (){return ['John Doe','Peter Johnson', 'Mary Patricks'][Math.floor(Math.random()*3+0.1)]}(),
                    elementcontent: function () {
                        var randomText = "Element " + (i + 1) + " ";
                        for (var j = 0; j < Math.random() * 50 + 3; j++) {
                            randomText = randomText + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10) + " "
                        }
                        return randomText
                    }(),
                    category: function (){if (i<7) {return "Category A"} else {return "Category B"}}()
                },
                false,
                "id01"+i
            );
        }

        $scope.myFamousCode .add(scrollView);




        // Resizing
        // Execution is "debounced" (underscore-lib) - which means:
        // Maximum run of once per 200 milliseconds (see parameter in last line)
        var updateLayout = _.debounce(function(e) {

            // central update here:
            $scope.configUpdate();

            // Resize animation here:
            $scope.resizeTransition = new Transitionable([1,1,1]);
            $scope.resizeTransition.set([0.8,0.8,1]);
            $scope.resizeTransition.set([1,1,1], {duration: 600, curve: Easing['outBounce']});

        }, 200);



        var resizeEndTimeout;
        Engine.on('resize', function() {
            updateLayout();
            // Check for end of resize (via timeout)
            clearTimeout(resizeEndTimeout);
            resizeEndTimeout = setTimeout(resizeEnd, 200);
        });

        function resizeEnd(){
            // Haven't resized for 200ms!

        }

    })


;
