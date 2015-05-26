// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('slidebox', ['ionic', 'tabSlideBox']);
angular.module('your_app_name', ['ionic', 'your_app_name.directives', 'your_app_name.controllers', 'templates', 'your_app_name.services', 'your_app_name.config', 'ngMap', 'your_app_name.filters', 'angularMoment', 'underscore',
'your_app_name.factories', 'ngCordova'])


.run(['$ionicPlatform', 'AuthService', '$rootScope', '$state', 'PushNotificationsService', function($ionicPlatform, AuthService, $rootScope, $state, PushNotificationsService) {

  $ionicPlatform.on("deviceready", function(){

    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        //update user avatar and go on
        AuthService.updateUserAvatar();

        $state.go('app.home');

      }
      else
      {
        $state.go('walkthrough');
      }

    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    PushNotificationsService.register();

  });

  $ionicPlatform.on("resume", function(){
    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === false)
      {
        $state.go('walkthrough');
      }else{
        //update user avatar and go on
        AuthService.updateUserAvatar();
      }
    });

    PushNotificationsService.register();
  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate)
    {
      AuthService.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
          event.preventDefault();
          $state.go('walkthrough');
        }
      });
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('walkthrough', {
    url: "/",
    templateUrl: "walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
    }
  })

  .state('register', {
    url: "/register",
    templateUrl: "register.html",
    controller: 'RegisterCtrl',
    data: {
      authenticate: false
    }
  })

  .state('login', {
    url: "/login",
    templateUrl: "login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "forgot-password.html",
    controller: 'ForgotPasswordCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "home.html",
        controller: 'HomeCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.contact', {
    url: "/contact",
    views: {
      'menuContent': {
        templateUrl: "contact.html",
        controller: 'ContactCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.post', {
    url: "/post/:postId",
    views: {
      'menuContent': {
        templateUrl: "post.html",
        controller: 'PostCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })


  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "settings.html",
        controller: 'SettingCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.category', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "category.html",
        controller: 'PostCategoryCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
}])

;

angular.module('your_app_name.directives', [])

.directive('recursiveMenu', ['$compile', function($compile) {
	return {
		restrict: 'EACM',
		priority: 100000,
		compile: function(tElement, tAttr) {
			var compiledContents, contents;
			contents = tElement.contents().remove();
			compiledContents = null;
			return function(scope, iElement, iAttr) {
				if (!compiledContents) {
					compiledContents = $compile(contents);
				}
				compiledContents(scope, function(clone, scope) {
					return iElement.append(clone);
				});
			};
		}
	};
}])

.directive('pushMenu', function(){
	return {
		scope: {
			menu: '=',
			level: '='
		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
			this.getMenu = function(){
				return $scope.menu;
			};
		}],
		templateUrl: 'partials/main-menu.html',
		restrict: 'E',
		replace: true,
		transclude: true
	};
})

.directive('menuLevel', ['_', function(_){
	return {
		scope: {
			menu: '=',
			level: '='
		},
		link: function(scope, element, attr, menuCtrl) {
			scope.original_menu = menuCtrl.getMenu();
			scope.childrenLevel = scope.level + 1;

			scope.openSubMenu = function(item_menu, parent_menu, $event) {
				// console.log("open sub menu from child directive");
				// Check if it has sub levels
				if(!_.isUndefined(item_menu) && !_.isUndefined(item_menu.items) && item_menu.items.length > 0)
				{
					// console.log("has sub menus, OPENING!");
					$event.preventDefault();

					// Open sub menu
					var sub_level = document.querySelector('.mp-level.level-id-'+item_menu.id);
					this.$parent._openMenu(sub_level);
				}
			};

			scope.backToPreviousMenu = function(menu, $event){
				$event.preventDefault();
				$event.stopPropagation();

				// Close current menu
				var current_level = document.querySelector('.mp-level.level-id-'+menu.id);
				this.$parent._closeMenu(current_level);
			};

			scope._setTransform = function(val, el){
				el.style.WebkitTransform = val;
				el.style.MozTransform = val;
				el.style.transform = val;
			};

			scope._openMenu = function(level){
				// console.log("opening menu!");
				this._setTransform('translate3d(0,0,0)', level);
			};

			scope._closeMenu = function(level){
				// console.log("closing menu!");
				this._setTransform('translate3d(100%,0,0)', level);
			};
		},
		templateUrl: 'partials/menu-level.html',
		require: '^pushMenu',
		restrict: 'EA',
		replace: true,
		transclude: true
	};
}])

.directive('wpSearch', ['_', 'SearchService', '$q', function(_, SearchService, $q){
	return {
		scope: {
			// menu: '=',
			// shown: '='
		},
		controller: ['$scope', function($scope) {
			var utils = this;

			$scope.close_shown = false;

			this.showClose = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.close_shown = true;
				});
			};

			this.hideClose = function(){
				// This method is called from hideResultsPanel that is called from $scope.closeSearch,
				// which is triggered from within the directive so it doesn't need $scope.apply
				$scope.close_shown = false;
			};

			this.showResultsPanel = function(query){
				utils.showClose();
				// console.log("broadcast show-results-panel");
				var search_results_promise = null;
				if(!_.isUndefined(query))
				{
					// Then perform search, and returns a promise
					search_results_promise = SearchService.search(query);
				}
				$scope.$broadcast("show-results-panel", search_results_promise);
			};

			this.cleanResultsPanel = function(){
				// console.log("broadcast clean-results-panel");
				$scope.$broadcast("clean-results-panel");
			};

			this.hideResultsPanel = function(){
				// console.log("broadcast hide-results-panel");
				utils.hideClose();
				$scope.$broadcast("hide-results-panel", 1);
			};

			$scope.closeSearch = function($event) {
				$event.stopPropagation();
				$event.preventDefault();
				// console.log("close search, should hide panel");
				// console.log($event);
				utils.hideResultsPanel();
			};

			// $scope.closeSearch = function() {
			// 	utils.hideResultsPanel();
			// };
		}],
		templateUrl: 'partials/wp-search.html',
		restrict: 'E',
		replace: true,
		transclude: true
	};
}])

.directive('searchInput', ['$timeout', 'SearchService', '$ionicLoading', function($timeout, SearchService, $ionicLoading){
	return {
		require: '^wpSearch',
		link: function(scope, element, attr, wpSearchCtrl) {
			var timeout = null;

			scope.$on("hide-results-panel", function(event, value){
				// console.log("Broadcast received, value: ", value);
				$timeout.cancel(timeout);
				// console.log("CANCEL because of hide panel");
				element[0].value = "";
			});

			element.on('focus', function(event) {
				// event.preventDefault();
				// event.stopPropagation();
				// console.log("FOCUS on (current target): ", event.currentTarget);
				// console.log("FOCUS on (target): ", event.target);
				// maybe emit event here so the serch results directive can update itself
				wpSearchCtrl.showResultsPanel();
			});

			element.on('keyup', function(event) {
				event.preventDefault();
				event.stopPropagation();
				// console.log("KEYUP!");

				var target = this;

				if(timeout !== null)
				{
					// console.log("canceling search");
					$timeout.cancel(timeout);
				}

				var query = target.value;

				timeout = $timeout(function(){

					if(query.trim().length>0)
					{

						$ionicLoading.show({
							template: 'Searching...'
						});

						// Perform search
						wpSearchCtrl.showResultsPanel(query);
						// console.log("searching for query: ", query);
					}
					else
					{
						// Clean previous search results
						wpSearchCtrl.cleanResultsPanel();
					}
				}, 800);
			});

		},
		restrict: 'A'
	};
}])

.directive('searchResults', ['_', '$ionicLoading', function(_, $ionicLoading){
	return {
		require: '^wpSearch',
		link: function(scope, element, attr, wpSearchCtrl) {
			var _setTransform = function(val, el){
						el.style.WebkitTransform = val;
						el.style.MozTransform = val;
						el.style.transform = val;
					};

			scope.$on("show-results-panel", function(event, search_results_promise){
				// console.log("Broadcast received, value: ", search_results_promise);

				_setTransform('translate3d(0,0,0)', element[0]);

				// search_results_promise is null when we the search query was empty
				if(search_results_promise)
				{
					// Then show search results in tabs
					search_results_promise.then(function(results){
						// console.log("promise DONE, search OK: ", results);

						$ionicLoading.hide();

						scope.loadSearchResults(results);
					}, function(error){
						// console.log("search ERROR: ", error);
					});
				}
			});

			scope.$on("clean-results-panel", function(event, value){
				// Clean previous search results
				scope.cleanSearchResults();
			});

			scope.$on("hide-results-panel", function(event, value){
				// console.log("Broadcast received, value: ", value);
				_setTransform('translate3d(0,100%,0)', element[0]);
			});
		},
		controller: ['$scope', function($scope) {
			var tabs = $scope.tabs = [];
			$scope.query = "";

			$scope.select = function(tab) {
				angular.forEach(tabs, function(tab) {
					tab.selected = false;
				});
				tab.selected = true;
			};

			$scope.loadSearchResults = function(results){
				_.each(tabs, function(tab){
					var tab_search = _.findWhere(results, {_id : tab.tabid});
					tab.results = tab_search.results;
				});
			};

			$scope.cleanSearchResults = function(){
				_.each(tabs, function(tab){
					tab.results = [];
				});
			};

			this.addTab = function(tab) {
				if (tabs.length === 0) {
					$scope.select(tab);
				}
				tabs.push(tab);
			};
		}],
		templateUrl: 'partials/search-results.html',
		restrict: 'E',
		replace: true,
		transclude: true
	};
}])

.directive('myTab', ['$state', '$ionicHistory', function($state, $ionicHistory) {
	return {
		require: '^searchResults',
		restrict: 'E',
		transclude: true,
		scope: {
			title: '@',
			tabid: '@',
			query: '@query',
		},
		link: function(scope, element, attrs, tabsCtrl) {
			// This helped me understand scope inheritance between directives in angular: https://github.com/angular/angular.js/wiki/Understanding-Scopes
			scope.results = [];
			tabsCtrl.addTab(scope);

			scope.goToPost = function(post){
				$ionicHistory.nextViewOptions({
					disableAnimate: true
				});
				$state.go('app.post', {postId: post.id});
			};
		},
		templateUrl: 'partials/my-tab.html'
	};
}])


.directive('postCard', function() {
	return {
		templateUrl: 'partials/post-card.html'
	};
})


.directive('showHideContainer', function(){
	return {
		scope: {

		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
			$scope.show = false;

			$scope.toggleType = function($event){
				$event.stopPropagation();
				$event.preventDefault();

				$scope.show = !$scope.show;

				// Emit event
				$scope.$broadcast("toggle-type", $scope.show);
			};
		}],
		templateUrl: 'partials/show-hide-password.html',
		restrict: 'A',
		replace: false,
		transclude: true
	};
})


.directive('showHideInput', function(){
	return {
		scope: {

		},
		link: function(scope, element, attrs) {
			// listen to event
			scope.$on("toggle-type", function(event, show){
				var password_input = element[0],
						input_type = password_input.getAttribute('type');

				if(!show)
				{
					password_input.setAttribute('type', 'password');
				}

				if(show)
				{
					password_input.setAttribute('type', 'text');
				}
			});
		},
		require: '^showHideContainer',
		restrict: 'A',
		replace: false,
		transclude: false
	};
})



;

angular.module('your_app_name.controllers', [])

// APP - RIGHT MENU
.controller('AppCtrl', ['$scope', 'AuthService', function($scope, AuthService) {

  $scope.$on('$ionicView.enter', function(){
    // Refresh user data & avatar
    $scope.user = AuthService.getUser();
  });
}])

// CATEGORIES MENU
.controller('PushMenuCtrl', ['$scope', 'CategoryService', function($scope, CategoryService) {

  var getItems = function(parents, categories){

    if(parents.length > 0){

      _.each(parents, function(parent){
        parent.name = parent.title;
        parent.link = parent.slug;

        var items = _.filter(categories, function(category){ return category.parent===parent.id; });

        if(items.length > 0){
          parent.menu = {
            title: parent.title,
            id: parent.id,
            items:items
          };
          getItems(parent.menu.items, categories);
        }
      });
    }
    return parents;
  };

  CategoryService.getCategories()
  .then(function(data){


    var sorted_categories = _.sortBy(data.categories, function(category){ return category.title; });
    var parents = _.filter(sorted_categories, function(category){ return category.parent===0; });
    var result = getItems(parents, sorted_categories);

    $scope.menu = {
      title: 'All Categories',
      id: '0',
      items: result
    };
  });
}])


// BOOKMARKS
.controller('BookMarksCtrl', ['$scope', '$rootScope', 'BookMarkService', function($scope, $rootScope, BookMarkService) {

  $scope.bookmarks = BookMarkService.getBookmarks();

  // When a new post is bookmarked, we should update bookmarks list
  $rootScope.$on("new-bookmark", function(event, post_id){
    $scope.bookmarks = BookMarkService.getBookmarks();
  });
}])


// CONTACT
.controller('ContactCtrl', ['$scope', function($scope) {

  //map
  $scope.position = {
    lat: 43.07493,
    lng: -89.381388
  };

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

}])

// SETTINGS
.controller('SettingCtrl', ['$scope', '$ionicActionSheet', '$ionicModal', '$state', 'AuthService', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
  $scope.notifications = true;
  $scope.sendLocation = false;

  $ionicModal.fromTemplateUrl('partials/terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.terms_modal = modal;
  });

  $ionicModal.fromTemplateUrl('partials/faqs.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.faqs_modal = modal;
  });

  $ionicModal.fromTemplateUrl('partials/credits.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.credits_modal = modal;
  });

  $scope.showTerms = function() {
    $scope.terms_modal.show();
  };

  $scope.showFAQS = function() {
    $scope.faqs_modal.show();
  };

  $scope.showCredits = function() {
    $scope.credits_modal.show();
  };

  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      // buttons: [
      // { text: '<b>Share</b> This' },
      // { text: 'Move' }
      // ],
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awesome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        AuthService.logOut();
        $state.go('login');
      }
    });
  };
}])

//EMAIL SENDER
.controller('EmailSenderCtrl', ['$scope', function($scope) {

  $scope.sendFeedback = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'john@doe.com',
          cc:      'jane@doe.com',
          subject: 'Feedback',
          body:    'This app is awesome'
        });
      }
    );
  };

  $scope.sendContactMail = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'john@doe.com',
          cc:      'jane@doe.com',
          subject: 'Contact',
          body:    'Contact from ionWordpress app'
        });
      }
    );
  };
}])


// RATE THIS APP
.controller('RateAppCtrl', ['$scope', function($scope) {

  $scope.rateApp = function(){
    if(ionic.Platform.isIOS()){
      AppRate.preferences.storeAppURL.ios = '<my_app_id>';
      AppRate.promptForRating(true);
    }else if(ionic.Platform.isAndroid()){
      AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
      AppRate.promptForRating(true);
    }
  };
}])


//ADMOB
.controller('AdmobCtrl', ['$scope', '$ionicActionSheet', 'AdMob', function($scope, $ionicActionSheet, AdMob) {

  $scope.manageAdMob = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show AdMob Banner' },
      { text: 'Show AdMob Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        AdMob.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show AdMob Banner')
        {
          console.log("show AdMob banner");
          AdMob.showBanner();
        }
        if(button.text == 'Show AdMob Interstitial')
        {
          console.log("show AdMob interstitial");
          AdMob.showInterstitial();
        }
        return true;
      }
    });
  };
}])


//IAD
.controller('iAdCtrl', ['$scope', '$ionicActionSheet', 'iAd', function($scope, $ionicActionSheet, iAd) {

  $scope.manageiAd = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show iAd Banner' },
      { text: 'Show iAd Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show - Interstitial only works in iPad',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        iAd.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show iAd Banner')
        {
          console.log("show iAd banner");
          iAd.showBanner();
        }
        if(button.text == 'Show iAd Interstitial')
        {
          console.log("show iAd interstitial");
          iAd.showInterstitial();
        }
        return true;
      }
    });
  };
}])


// WALKTHROUGH
.controller('WalkthroughCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', function($scope, $state, $ionicSlideBoxDelegate) {

  $scope.$on('$ionicView.enter', function(){
    //this is to fix ng-repeat slider width:0px;
    $ionicSlideBoxDelegate.$getByHandle('walkthrough-slider').update();
  });
}])

//LOGIN
.controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', 'AuthService', 'PushNotificationsService', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService) {
  $scope.user = {};

  $scope.doLogin = function(){

    $ionicLoading.show({
      template: 'Loging in...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password
    };

    AuthService.doLogin(user)
    .then(function(user){
      //success
      $state.go('app.home');

      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
}])


// FORGOT PASSWORD
.controller('ForgotPasswordCtrl', ['$scope', '$state', '$ionicLoading', 'AuthService', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.recoverPassword = function(){

    $ionicLoading.show({
      template: 'Recovering password...'
    });

    AuthService.forgotPassword($scope.user.userName)
    .then(function(data){
      if(data.status == "error"){
        $scope.error = data.error;
      }else{
        $scope.message ="Link for password reset has been emailed to you. Please check your email.";
      }
      $ionicLoading.hide();
    });
  };
}])


// REGISTER
.controller('RegisterCtrl', ['$scope', '$state', '$ionicLoading', 'AuthService', 'PushNotificationsService', function($scope, $state, $ionicLoading, AuthService, PushNotificationsService) {
  $scope.user = {};

  $scope.doRegister = function(){

    $ionicLoading.show({
      template: 'Registering user...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password,
      email: $scope.user.email,
      displayName: $scope.user.displayName
    };

    AuthService.doRegister(user)
    .then(function(user){
      //success
      $state.go('app.home');
      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
}])

// HOME - GET RECENT POSTS
.controller('HomeCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', 'PostService', function($scope, $rootScope, $state, $ionicLoading, PostService) {
  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading classes...'
    });

    //Always bring me the latest posts => page=1
    PostService.getRecentPosts(1)
    .then(function(data){

      $scope.totalPages = data.pages;
      $scope.posts = PostService.shortenPosts(data.posts);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getRecentPosts($scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Class Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
  };

  $scope.doRefresh();

}])


// POST
.controller('PostCtrl', ['$scope', '$state', '$ionicLoading', 'PostService', '$stateParams', 'AuthService', '$ionicScrollDelegate', function($scope, $state, $ionicLoading, PostService, $stateParams, AuthService, $ionicScrollDelegate) {
  $ionicLoading.show({
    template: 'Loading...'
  });

  var postId = $stateParams.postId;
  PostService.getPost(postId)
  .then(function(data){
    $scope.post = data.post;
    $scope.comments = _.map(data.post.comments, function(comment){
      if(comment.author){
        PostService.getUserGravatar(comment.author.id)
        .then(function(data){
          comment.user_gravatar = data.avatar;
        });
        return comment;
      }else{
        return comment;
      }
    });
    $ionicLoading.hide();
  });

  $scope.sharePost = function(link){
    window.plugins.socialsharing.share('Check this class here: ', null, null, link);
  };

  $scope.addComment = function(){

    $ionicLoading.show({
      template: 'Submitting comment...'
    });

    PostService.submitComment($scope.post.id, $scope.new_comment)
    .then(function(data){
      if(data.status=="ok"){
        var user = AuthService.getUser();
        var comment = {
          author: {name: user.data.username},
          content:$scope.new_comment,
          date: Date.now(),
          user_gravatar : user.data.avatar,
          id: data.comment_id
        };
        $scope.comments.push(comment);
        $scope.new_comment = "";
        $scope.new_comment_id = data.comment_id;
        $ionicLoading.hide();
        // Scroll to new post
        $ionicScrollDelegate.scrollBottom(true);
      }
    });
  };
}])


// CATEGORY
.controller('PostCategoryCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$stateParams', 'PostService', function($scope, $rootScope, $state, $ionicLoading, $stateParams, PostService) {

  $scope.category = {};
  $scope.category.id = $stateParams.categoryId;
  $scope.category.title = $stateParams.categoryTitle;

  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: 'Loading posts...'
    });

    PostService.getPostsFromCategory($scope.category.id, 1)
    .then(function(data){
      $scope.totalPages = data.pages;
      $scope.posts = PostService.shortenPosts(data.posts);

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getRecentPosts($scope.category.id, $scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
  };

  $scope.doRefresh();
}])

;

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bookmarks.html","<ion-view class=\"bookmarks-view\">\n  <ion-nav-title>\n    <span>Bookmarks</span>\n  </ion-nav-title>\n  <ion-content>\n    <div class=\"row bookmarks-container\">\n      <div ng-if=\"bookmarks.length == 0\" class=\"col col-center\">\n        <div class=\"empty-results\">\n          <i class=\"icon ion-bookmark\"></i>\n          <h3 class=\"no-bookmarks\">There\'s nothing here yet. Start exploring!</h3>\n        </div>\n      </div>\n      <div ng-if=\"bookmarks.length > 0\" class=\"col\">\n        <ul class=\"bookmarks-list\">\n          <li class=\"bookmark-item\" ng-repeat=\"bookmark in bookmarks\">\n            <a ui-sref=\"app.post({postId : bookmark.id})\">\n              <h2 class=\"post-title\" ng-bind-html=\"bookmark.title | rawHtml\"></h2>\n              <p class=\"post-date\">Posted <span class=\"post-time\" am-time-ago=\"bookmark.date\"></span></p>\n            </a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("category.html","<ion-view class=\"category-view\">\n  <ion-nav-title>\n    <span>{{category.title}}</span>\n  </ion-nav-title>\n  <ion-content>\n\n    <!-- Refresh to get the new posts -->\n    <ion-refresher pulling-text=\"Pull to refresh...\" on-refresh=\"doRefresh()\">\n    </ion-refresher>\n\n    <div class=\"posts\">\n      <div post-card ng-repeat=\"post in posts\" class=\"post-card\"></div>\n    </div>\n\n    <!-- Infinit scroll -->\n    <ion-infinite-scroll ng-if=\"moreDataCanBeLoaded()\" on-infinite=\"loadMoreData()\" distance=\"1%\" icon=\"ion-loading-c\">\n    </ion-infinite-scroll>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("contact.html","<ion-view class=\"contact-view\">\n  <ion-nav-title>\n    <span>Contact</span>\n  </ion-nav-title>\n  <ion-content>\n    <div>\n      <map data-tap-disabled=\"true\" center=\"{{position.lat}},{{position.lng}}\" zoom=\"15\" disable-default-u-i=\"true\">\n        <marker\n          position=\"{{position.lat}},{{position.lng}}\"\n          title=\"Hello Marker\"\n          visible=\"true\">\n        </marker>\n      </map>\n    </div>\n    <div class=\"contact-content\">\n      <div class=\"\">\n        <p>\n          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna\n          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n        </p>\n        <p>\n          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,\n          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto\n          beatae vitae dicta sunt explicabo.\n        </p>\n      </div>\n      <div class=\"contact-details-item\">\n        <h4>Address</h4>\n        <div class=\"featured\">Our Inc.</div>\n        <div>2283 Monroe Drive</div>\n        <div>Rochester, NY 14606</div>\n      </div>\n      <div class=\"contact-details-item\">\n        <h4>Social Networks</h4>\n        <div class=\"row social-networks\">\n          <div class=\"col\"><a href=\"\"><i class=\"icon ion-social-twitter\" style=\"color: #37b9e1;\"></i></a></div>\n          <div class=\"col\"><a href=\"\"><i class=\"icon ion-social-facebook\" style=\"color: #3e649e;\"></i></a></div>\n          <div class=\"col\"><a href=\"\"><i class=\"icon ion-social-dribbble\" style=\"color: #e36a96;\"></i></a></div>\n          <div class=\"col\"><a href=\"\"><i class=\"icon ion-social-rss\" style=\"color: #f18334;\"></i></a></div>\n          <div class=\"col\"><a href=\"\"><i class=\"icon ion-social-pinterest\" style=\"color: #c6484a;\"></i></a></div>\n        </ul>\n      </div>\n      <div class=\"send-email\">\n        <button class=\"button button-outline button-block featured\" ng-controller=\"EmailSenderCtrl\" ng-click=\"sendContactMail()\">\n          Send us an email\n        </button>\n      </div>\n\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("forgot-password.html","<ion-view class=\"forgot-password-view\">\n  <ion-nav-bar class=\"view-navigation\">\n    <ion-nav-back-button>\n    </ion-nav-back-button>\n  </ion-nav-bar>\n  <ion-content class=\"padding\">\n    <div class=\"row form-heading\">\n      <div class=\"col col-center\">\n        <h1 class=\"form-title\">Recover your password</h1>\n      </div>\n    </div>\n    <div class=\"row form-wrapper\">\n      <div class=\"col\">\n        <form name=\"forgot_password_form\" class=\"\" novalidate>\n          <div class=\"list input-fields\">\n            <label class=\"item item-input\">\n              <span class=\"input-label\">Username</span>\n              <input type=\"text\" name=\"user_name\" ng-model=\"user.userName\" required>\n            </label>\n            <button type=\"submit\" class=\"recover button button-positive button-block\" ng-click=\"recoverPassword()\" ng-disabled=\"forgot_password_form.$invalid\">\n              Recover it\n            </button>\n            <p ng-show=\"error\" class=\"message error\">{{error}}</p>\n            <p ng-show=\"message\" class=\"message\">{{message}}</p>\n          </div>\n        </form>\n        <div class=\"alternative-actions\">\n          <a class=\"log-in button button-small button-clear\" ui-sref=\"login\">\n            Log In\n          </a>\n          <a class=\"sign-up button button-small button-clear\" ui-sref=\"register\">\n            Sign Up\n          </a>\n        </div>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("home.html","<ion-view class=\"home-view\">\n  <ion-nav-title>\n    <span>- Browse Classes -</span>\n  </ion-nav-title>\n  <ion-content>\n\n    <!-- Refresh to get the new posts -->\n    <ion-refresher pulling-text=\"Pull to refresh...\" on-refresh=\"doRefresh()\">\n    </ion-refresher>\n\n    <div class=\"posts\">\n      <div post-card ng-repeat=\"post in posts\" class=\"post-card\"></div>\n    </div>\n\n    <!-- Infinit scroll -->\n    <ion-infinite-scroll ng-if=\"moreDataCanBeLoaded()\" on-infinite=\"loadMoreData()\" distance=\"1%\" icon=\"ion-loading-c\">\n    </ion-infinite-scroll>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("login.html","<ion-view class=\"login-view\">\n  <ion-nav-bar class=\"view-navigation\">\n    <ion-nav-back-button>\n    </ion-nav-back-button>\n  </ion-nav-bar>\n  <ion-content class=\"padding\">\n    <div class=\"row form-heading\">\n      <div class=\"col col-center\">\n        <!-- <h1 class=\"form-title\">Welcome back</h1> -->\n      </div>\n    </div>\n    <div class=\"row form-wrapper\">\n      <div class=\"col\">\n        <form name=\"login_form\" class=\"\" novalidate>\n          <div class=\"list input-fields\">\n            <label class=\"item item-input\">\n              <!--<span class=\"input-label\">Username</span>-->\n              <input type=\"text\" placeholder=\"Username\" name=\"user_name\" ng-model=\"user.userName\" required>\n            </label>\n            <label class=\"item item-input\" show-hide-container>\n              <!--<span class=\"input-label\">Password</span>-->\n              <input type=\"password\" placeholder=\"Password\" name=\"password\" ng-model=\"user.password\" required show-hide-input>\n            </label>\n            <button type=\"submit\" class=\"login button button-block\" ng-click=\"doLogin()\" ng-disabled=\"login_form.$invalid\">\n              Log in\n            </button>\n            <p ng-show=\"error\" class=\"message error\">{{error}}</p>\n          </div>\n        </form>\n        <div class=\"alternative-actions\">\n          <a class=\"forgot-password button button-small button-clear\" ui-sref=\"forgot_password\">\n            Forgot Password?\n          </a>\n          <a class=\"sign-up button button-small button-clear\" ui-sref=\"register\">\n            Sign Up\n          </a>\n        </div>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("post.html","<ion-view class=\"post-view\">\n  <ion-nav-title>\n    <span ng-bind-html=\"post.title | rawHtml\"></span>\n  </ion-nav-title>\n  <ion-content>\n    <div class=\"post\">\n      <div class=\"card-header\">\n        <img class=\"featured-img\" ng-src=\"{{post.thumbnail}}\">\n        <h1 ng-bind-html=\"post.title | rawHtml\"></h1>\n        <h2>Posted <span am-time-ago=\"post.date\"></span> by <span class=\"author\" ng-bind-html=\"post.author.name | rawHtml\"></span></h2>\n      </div>\n      <div class=\"card-content\" ng-bind-html=\"post.content | rawHtml\"></div>\n      <button class=\"button button-block button-outline button-balanced\">\n        Check in\n      </button>\n    </div>\n    <div class=\"post-actions\">\n      <a class=\"card-button primary\" ng-click=\"sharePost(post.url)\"><i class=\"icon ion-forward\"></i></a>\n      <a ng-show=\"post.comment_count > 0\" class=\"card-button comment-count\">\n        <i class=\"icon ion-chatbox\"></i>{{post.comment_count}}\n      </a>\n    </div>\n    <div class=\"comments\">\n      <div class=\"list\">\n        <a class=\"item item-avatar\" ng-repeat=\"comment in comments\" href=\"#\" ng-class=\"{highlighted: comment.id === new_comment_id}\">\n          <img ng-src=\"{{comment.user_gravatar}}\">\n          <h2  ng-bind-html=\"comment.author.name | rawHtml\"><span class=\"comment-date\" am-time-ago=\"comment.date\"></span></h2>\n          <p class=\"message-content\" ng-bind-html=\"comment.content | rawHtml\"></p>\n        </a>\n      </div>\n    </div>\n  </ion-content>\n  <ion-footer-bar class=\"new-comment post-footer bar bar-footer\">\n    <form name=\"comment_form\" class=\"row\" novalidate>\n      <div class=\"col col-80 content col-center\">\n        <input class=\"new-comment-message\" type=\"text\" placeholder=\"Leave a comment...\" ng-model=\"new_comment\" required></input>\n      </div>\n      <div class=\"col col-20 button-container col-center\">\n        <button class=\"button button-clear send\" type=\"submit\" ng-click=\"addComment()\" ng-disabled=\"comment_form.$invalid\">\n          Send\n        </button>\n      </div>\n    </form>\n  </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("register.html","<ion-view class=\"register-view\">\n  <ion-nav-bar class=\"view-navigation\">\n    <ion-nav-back-button>\n    </ion-nav-back-button>\n  </ion-nav-bar>\n  <ion-content class=\"padding\">\n    <div class=\"row form-heading\">\n      <div class=\"col col-center\">\n        <h1 class=\"form-title\">Create your account</h1>\n      </div>\n    </div>\n    <div class=\"row form-wrapper\">\n      <div class=\"col\">\n        <form name=\"signup_form\" class=\"\" novalidate>\n          <div class=\"list input-fields\">\n            <label class=\"item item-input\">\n              <!-- <span class=\"input-label\">Username</span> -->\n              <input type=\"text\" placeholder=\"Please enter your desired username\" name=\"user_name\" ng-model=\"user.userName\" required>\n            </label>\n            <label class=\"item item-input\">\n              <!-- <span class=\"input-label\">Name</span> -->\n              <input type=\"text\" placeholder=\"Please enter your name\" name=\"display_name\" ng-model=\"user.displayName\" required>\n            </label>\n            <label class=\"item item-input\">\n              <!-- <span class=\"input-label\">Email</span> -->\n              <input type=\"email\" placeholder=\"Please enter your email address\" name=\"email\" ng-model=\"user.email\" required>\n            </label>\n            <label class=\"item item-input\" show-hide-container>\n              <!-- <span class=\"input-label\">Password</span> -->\n              <input type=\"password\" placeholder=\"Please create a password\" name=\"password\" ng-model=\"user.password\" required show-hide-input>\n            </label>\n            <button type=\"submit\" class=\"register button button-block\" ng-click=\"doRegister()\" ng-disabled=\"signup_form.$invalid\">\n              Register\n            </button>\n            <p ng-show=\"error\" class=\"message error\">{{error}}</p>\n          </form>\n        </div>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("settings.html","<ion-view class=\"settings-view\">\n  <ion-nav-buttons side=\"left\">\n    <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n  </ion-nav-buttons>\n  <ion-nav-title>\n    <span>Settings</span>\n  </ion-nav-title>\n  <ion-content>\n    <ul class=\"list\">\n\n      <ion-toggle ng-model=\"notifications\" toggle-class=\"toggle-dark\">Push Notifications</ion-toggle>\n      <ion-toggle ng-model=\"sendLocation\" toggle-class=\"toggle-dark\">Send Location</ion-toggle>\n\n      <div class=\"item item-divider\">OPTIONS</div>\n      <a class=\"item option\" ng-controller=\"EmailSenderCtrl\" ng-click=\"sendFeedback()\">\n        <i class=\"icon ion-chatbox dark\"></i>\n        <span class=\"title\">Send feedback</span>\n      </a>\n      <a class=\"item option\" ng-controller=\"RateAppCtrl\" ng-click=\"rateApp()\">\n        <i class=\"icon ion-heart assertive\"></i>\n        <span class=\"title\">Rate this app</span>\n      </a>\n      <a class=\"item option\" ng-controller=\"AdmobCtrl\" ng-click=\"manageAdMob()\">\n        <i class=\"icon ion-social-usd\"></i>\n        <span class=\"title\">AdMob</span>\n      </a>\n      <a class=\"item option\" ng-controller=\"iAdCtrl\" ng-click=\"manageiAd()\">\n        <i class=\"icon ion-social-usd\"></i>\n        <span class=\"title\">iAd</span>\n      </a>\n\n      <div class=\"item item-divider\">LEGAL</div>\n\n      <a class=\"item\" href=\"\" ng-click=\"showTerms()\">Terms of Service</a>\n      <a class=\"item\" href=\"\" ng-click=\"showFAQS()\">FAQS</a>\n      <a class=\"item\" href=\"\" ng-click=\"showCredits()\">Credits</a>\n\n      <div class=\"item item-divider\">ACCOUNT</div>\n      <a class=\"item option\" ng-click=\"showLogOutMenu()\">\n        <i class=\"icon ion-power\"></i>\n        <span class=\"title\">Log out</span>\n      </a>\n\n    </ul>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("side-menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n  <ion-side-menu-content class=\"post-size-14px\">\n    <ion-nav-bar class=\"bar app-top-bar\">\n      <ion-nav-back-button>\n      </ion-nav-back-button>\n      <ion-nav-buttons side=\"left\">\n        <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n        </button>\n      </ion-nav-buttons>\n      <ion-nav-buttons side=\"right\">\n        <button class=\"button button-icon button-clear ion-search\" menu-toggle=\"right\">\n        </button>\n      </ion-nav-buttons>\n    </ion-nav-bar>\n    <ion-nav-view name=\"menuContent\"></ion-nav-view>\n  </ion-side-menu-content>\n\n  <ion-side-menu class=\"main-menu\" side=\"left\" width=\"230\">\n    <ion-content>\n      <ion-list>\n        <ion-item class=\"heading-item item\" nav-clear menu-close ui-sref=\"app.settings\">\n          <img ng-src=\"{{user.avatar}}\">\n          <div class=\"heading-bg\">\n          </div>\n          <div class=\"heading-action item-icon-left\">\n            <i class=\"icon ion-gear-a\"></i>\n            <h2 class=\"greeting\">My settings</h2>\n          </div>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" nav-clear menu-close ui-sref=\"app.home\">\n          <!-- <i class=\"icon ion-home\"></i> -->\n          <i class=\"icon ion-planet\"></i>\n          <h2 class=\"menu-text\">Browse</h2>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" nav-clear menu-close ui-sref=\"#\">\n          <i class=\"icon ion-ios-checkmark-outline\"></i>\n          <h2 class=\"menu-text\">My Check-ins</h2>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" nav-clear menu-close ui-sref=\"app.bookmarks\">\n          <i class=\"icon ion-bookmark\"></i>\n          <h2 class=\"menu-text\">My Bookmarks</h2>\n        </ion-item>\n        <ion-item class=\"item item-icon-left\" nav-clear menu-close ui-sref=\"app.contact\">\n          <i class=\"icon ion-location\"></i>\n          <h2 class=\"menu-text\">Contact</h2>\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  </ion-side-menu>\n\n  <ion-side-menu class=\"multi-level-push-menu\" side=\"right\" ng-controller=\"PushMenuCtrl\">\n    <ion-content has-bouncing=\"false\" scroll=\"false\">\n      <wp-search>\n      </wp-search>\n      <push-menu menu=\"menu\"></push-menu>\n    </ion-content>\n  </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("walkthrough.html","<ion-view class=\"walkthrough-view\" cache-view=\"false\">\n  <ion-content scroll=\"false\">\n    <div class=\"top-content row\">\n      <ion-slide-box delegate-handle=\"walkthrough-slider\" show-pager=\"true\">\n        <ion-slide>\n          <div class=\"row slide-content\">\n            <div class=\"col\">\n              <h3 class=\"slide-h\"></h3>\n              <img class=\"slide-image\" ng-src=\"img/logo.png\"/>\n              <p class=\"slide-p\">\n                \n              </p>\n            </div>\n          </div>\n        </ion-slide>\n        <ion-slide>\n          <div class=\"row slide-content\">\n            <div class=\"col\">\n              <h3 class=\"slide-h\">We have what you need</h3>\n              <img class=\"slide-image\" ng-src=\"img/logo.png\"/>\n            </div>\n          </div>\n        </ion-slide>\n      </ion-slide-box>\n    </div>\n    <div class=\"bottom-content row\">\n      <div class=\"col col-center\">\n        <a class=\"login button button-block\" ui-sref=\"login\">\n          Log In\n        </a>\n      </div>\n      <div class=\"col col-center\">\n        <a class=\"sign-up button button-block\" ui-sref=\"register\">\n          Register\n        </a>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("partials/credits.html","<ion-modal-view>\n	<ion-header-bar>\n		<h1 class=\"title\">Credits</h1>\n		<div class=\"button button-clear\" ng-click=\"credits_modal.hide()\"><span class=\"icon ion-close\"></span></div>\n	</ion-header-bar>\n	<ion-content>\n		<div class=\"credits\">\n\n\n			<p>Thanks for using our products and services (“Services”). Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n			\n		</div>\n	</ion-content>\n</ion-modal-view>\n");
$templateCache.put("partials/faqs.html","<ion-modal-view>\n	<ion-header-bar>\n		<h1 class=\"title\">FAQS</h1>\n		<div class=\"button button-clear\" ng-click=\"faqs_modal.hide()\"><span class=\"icon ion-close\"></span></div>\n	</ion-header-bar>\n	<ion-content>\n		<div class=\"faqs\">\n			<ul class=\"list\">\n				<li class=\"faq-item\">\n					<h5>What is Lorem Ipsum?</h5>\n					<p>\n						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n				</li>\n				<li class=\"faq-item\">\n					<h5>Where does it come from?</h5>\n					<p>\n						Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>\n				</li>\n				<li class=\"faq-item\">\n					<h5>Why do we use it?</h5>\n					<p>\n						It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. </p><p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n				</li>\n			</ul>\n		</div>\n	</ion-content>\n</ion-modal-view>\n");
$templateCache.put("partials/main-menu.html","<div class=\"menu-wrapper\">\n	<nav class=\"mp-menu\">\n		<menu-level menu=\"menu\" level=\"0\"></menu-level>\n	</nav>\n</div>\n");
$templateCache.put("partials/menu-level.html","<div class=\"mp-level\" ng-class=\"{\'mp-level-overlay\': menu.overlay, \'level-id-{{menu.id}}\':true}\">\n	<div class=\"menu-heading\" ng-class=\"{\'has-previous\': level > 0}\">\n		<a class=\"menu-title\" ng-if=\"level > 0\" menu-close ui-sref=\"app.category({categoryTitle: menu.title, categoryId: menu.id})\">\n			<h2 class=\"title-text\">{{menu.title}}</h2>\n			<span class=\"title-aux\">see all</span>\n		</a>\n		<a class=\"menu-title\" ng-if=\"level == 0\" href=\"\">\n			<h2 class=\"title-text\">{{menu.title}}</h2>\n		</a>\n		<a ng-if=\"level > 0\" class=\"menu-back icon ion-chevron-left\" ng-click=\"backToPreviousMenu(menu, $event)\" href=\"#\">back</a>\n	</div>\n	<ul class=\"categories-list\">\n		<li ng-repeat=\"item in menu.items\" class=\"category-item-container icon\" ng-class=\"{\'ion-chevron-right\': item.menu}\">\n			<div class=\"category-item\" ng-if=\"item.menu\">\n				<a class=\"category-details\" ng-click=\"openSubMenu(item.menu, menu, $event)\" href=\"\">\n					<span class=\"category-title\">{{ item.name }}</span>\n					<p class=\"category-description\">\n						{{item.description}}\n					</p>\n				</a>\n				<recursive-menu>\n					<menu-level menu=\"item.menu\" level=\"childrenLevel\"></menu-level>\n				</recursive-menu>\n			</div>\n			<div class=\"category-item\" ng-if=\"!item.menu\">\n				<a menu-close class=\"category-details\" ui-sref=\"app.category({categoryTitle: item.name, categoryId: item.id})\">\n					<span class=\"category-title\">{{ item.name }}</span>\n					<p class=\"category-description\">\n						{{item.description}}\n					</p>\n				</a>\n			</div>\n		</li>\n	</ul>\n</div>\n");
$templateCache.put("partials/my-tab.html","<div class=\"tab-content\" ng-show=\"selected\">\n	<ng-transclude></ng-transclude>\n	<div class=\"search-resume\">\n		<div ng-show=\"!query\">\n			<h2 class=\"no-query\">There\'s no query to search</h2>\n		</div>\n		<div ng-show=\"query\">\n			<h2 class=\"search-query\">Searching for: <span class=\"query-text\">{{ query }}</span></h2>\n		</div>\n	</div>\n	<div class=\"search-results-container\">\n		<div ng-show=\"results.length == 0 && query\">\n			<h2 class=\"no-results\">No results</h2>\n		</div>\n		<ul class=\"search-results-list\" ng-if=\"results.length > 0\">\n			<li class=\"search-result-item\" ng-repeat=\"result in results\">\n				<a menu-close ng-click=\"goToPost(result)\">\n					<h2 class=\"post-title\" ng-bind-html=\"result.title | rawHtml\"></h2>\n					<p class=\"post-date\">Posted <span class=\"post-time\" am-time-ago=\"result.date\"></span></p>\n				</a>\n			</li>\n		</ul>\n	</div>\n</div>\n");
$templateCache.put("partials/post-card.html","<div class=\"card-header event\">\n  <a class=\"event\" ui-sref=\"app.post({postId :post.id})\"><img class=\"featured-img\" ng-src=\"{{post.thumbnail}}\">\n    <div class=\"event-info\">\n      <div class=\"left\">\n        <div class=\"weekday\">Friday</div>\n        <div class=\"date\"><div class=\"month\">May</div><div class=\"day\">25</div></div>\n      </div>\n      <div class=\"right\">\n        <h1 ng-bind-html=\"post.title | rawHtml\"></h1>\n        <div class=\"time\"><i class=\"icon ion-ios-time\"></i> 7:30pm</div><div class=\"location\"><i class=\"icon ion-location\"></i> Viva Z Studios</div>\n      </div>\n    </div>\n  </a>\n  <!-- <h1 ng-bind-html=\"post.title | rawHtml\"></h1>\n  <h2>Posted <span am-time-ago=\"post.date\"></span> by <span class=\"author\" ng-bind-html=\"post.author.name | rawHtml\"></span></h2> -->\n</div>\n<!-- <div class=\"card-content\" ng-bind-html=\"post.content | rawHtml\"></div> -->\n<div class=\"card-footer\">\n  <a class=\"card-button secondary\" ng-click=\"sharePost(post.url)\"><i class=\"icon ion-forward\"></i></a>\n  <!-- <a class=\"card-button primary\" ui-sref=\"app.post({postId :post.id})\"><i class=\"icon ion-arrow-expand\"></i> --></a>\n  <a ng-show=\"post.comment_count > 0\" class=\"card-button comments\" ui-sref=\"app.post({postId :post.id})\">\n    <i class=\"icon ion-chatbox\"></i>{{post.comment_count}}\n  </a>\n  <a class=\"card-button secondary bookmark\" ng-click=\"bookmarkPost(post)\">\n    <i class=\"icon ion-bookmark\"></i>\n  </a>\n</div>\n");
$templateCache.put("partials/search-results.html","<div class=\"search-results-wrapper\">\n	<div class=\"item item-divider results-heading\">\n		<div class=\"tabs-striped tabs-background-dark tabs-color-stable\">\n			<div class=\"tabs\">\n				<a ng-repeat=\"tab in tabs\" ng-click=\"select(tab)\" ng-class=\"{ active: tab.selected }\" class=\"tab-item\">{{tab.title}}</a>\n			</div>\n		</div>\n	</div>\n	<div class=\"item item-body results-body\">\n		<div class=\"tabs-content\" ng-transclude></div>\n	</div>\n</div>\n");
$templateCache.put("partials/show-hide-password.html","<div class=\"show-hide-input\" ng-transclude>\n</div>\n<a class=\"toggle-view-anchor\" on-touch=\"toggleType($event)\">\n	<span ng-show=\"show\">HIDE</span>\n	<span ng-show=\"!show\">SHOW</span>\n</a>\n");
$templateCache.put("partials/terms.html","<ion-modal-view>\n	<ion-header-bar>\n		<h1 class=\"title\">Terms of Service</h1>\n		<div class=\"button button-clear\" ng-click=\"terms_modal.hide()\"><span class=\"icon ion-close\"></span></div>\n	</ion-header-bar>\n	<ion-content>\n		<div class=\"terms-of-service\">\n			<p>Last modified: April 14, 2014</p>\n			<h4 class=\"title\">Welcome to ionWordpress!</h4>\n			<p>Thanks for using our products and services (“Services”). Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n			<h4 class=\"title\">Using our Services</h4>\n			<p>You must follow any policies made available to you within the Services.</p>\n			<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n			<h4 class=\"title\">About these Terms</h4>\n			<p>We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services. You should look at the terms regularly. We’ll post notice of modifications to these terms on this page. We’ll post notice of modified additional terms in the applicable Service. Changes will not apply retroactively and will become effective no sooner than fourteen days after they are posted. However, changes addressing new functions for a Service or changes made for legal reasons will be effective immediately. If you do not agree to the modified terms for a Service, you should discontinue your use of that Service.</p>\n		</div>\n	</ion-content>\n</ion-modal-view>\n");
$templateCache.put("partials/wp-search.html","<div class=\"wp-search\">\n	<div class=\"search-box-wrapper\">\n		<div class=\"bar bar-header item-input-inset\">\n			<label class=\"item-input-wrapper\">\n				<i class=\"icon ion-search placeholder-icon\"></i>\n				<input type=\"search\" ng-model=\"query\" placeholder=\"Search posts\" search-input>\n			</label>\n			<button ng-click=\"closeSearch($event)\" class=\"button button-clear button-icon icon ion-close-circled\"></button>\n		</div>\n	</div>\n	<search-results>\n		<my-tab title=\"Posts\" tabid=\"posts\" query=\"{{query}}\">\n		</my-tab>\n		<my-tab title=\"Tags\" tabid=\"tags\" query=\"{{query}}\">\n		</my-tab>\n		<my-tab title=\"Authors\" tabid=\"authors\" query=\"{{query}}\">\n		</my-tab>\n	</search-results>\n</div>\n");}]);
angular.module('your_app_name.services', [])

// WP POSTS RELATED FUNCTIONS
.service('PostService', ['$rootScope', '$http', '$q', 'WORDPRESS_API_URL', 'AuthService', 'BookMarkService', function ($rootScope, $http, $q, WORDPRESS_API_URL, AuthService, BookMarkService){

  this.getRecentPosts = function(page) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_recent_posts/' +
      '?page='+ page +
      '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getUserGravatar = function(userId){
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
    '?user_id='+ userId +
    '&type=full' +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getPost = function(postId) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_post/' +
      '?post_id='+ postId +
      '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.submitComment = function(postId, content) {
    var deferred = $q.defer(),
        user = AuthService.getUser();

    $http.jsonp(WORDPRESS_API_URL + 'user/post_comment/' +
    '?post_id='+ postId +
    '&cookie='+ user.cookie +
    '&comment_status=1' +
    '&content='+ content +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getPostsFromCategory = function(categoryId, page) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_category_posts/' +
    '?id='+ categoryId +
    '&page='+ page +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.shortenPosts = function(posts) {
    //we will shorten the post
    //define the max length (characters) of your post content
    var maxLength = 600;
    return _.map(posts, function(post){
      if(post.content.length > maxLength){
        //trim the string to the maximum length
        var trimmedString = post.content.substr(0, maxLength);
        //re-trim if we are in the middle of a word
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
        post.content = trimmedString;
      }
      return post;
    });
  };

  this.sharePost = function(link){
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };

  this.bookmarkPost = function(post){
    BookMarkService.bookmarkPost(post);
    $rootScope.$broadcast("new-bookmark", post);
  };
}])


// SEARCH MENU RELATED FUNCTIONS
.service('SearchService', ['$rootScope', '$http', '$q', 'WORDPRESS_API_URL', function ($rootScope, $http, $q, WORDPRESS_API_URL){

  this.search = function(query) {

    var search_results = [],
        search_results_response = $q.defer(),
         promises = [
          this.searchPosts(query),
          this.searchTags(query),
          this.searchAuthors(query)
        ];

    $q.all(promises).then(function(promises_values){
      _.map(promises_values, function(promise_value){
        search_results.push({
          _id: promise_value.id,
          results:_.map(promise_value.posts, function(post){
            return {
              title: post.title,
              id:post.id,
              date: post.date,
              excerpt: post.excerpt
            };
          })
        });
      });
      search_results_response.resolve(search_results);
    });

    return search_results_response.promise;
  };

  this.searchPosts = function(query) {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_search_results/' +
    '?search='+ query +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      var promise_value = {
        id : "posts",
        posts : data.posts
      };
      deferred.resolve(promise_value);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.searchTags = function(query) {
    var tags_deferred = $q.defer(),
        results_deferred = $q.defer();

    //get all tags and filter the ones with the query in the title
    $http.jsonp(WORDPRESS_API_URL + 'get_tag_index/' +
    '?callback=JSON_CALLBACK')
    .success(function(data) {
      var tags = _.filter(data.tags, function(tag){
        return ((tag.title.indexOf(query) > -1));
                // || (tag.description.indexOf(query) > -1));
      });
      tags_deferred.resolve(tags);
    })
    .error(function(data) {
      tags_deferred.reject(data);
    });

    tags_deferred.promise.then(function(tags){
      //for each of the tags matching the query, bring the related posts
      var tag_promises = _.map(tags, function(tag){
        return $http.jsonp(WORDPRESS_API_URL + 'get_tag_posts/' +
          '?id='+ tag.id +
          '&callback=JSON_CALLBACK');
      });

      //prepare the response
      $q.all(tag_promises).then(function(results){
        var posts = [];
        _.map(results, function(result){
          _.each(result.data.posts, function(post){
            posts.push(post);
          });
        });
        var promise_value = {
          id : "tags",
          posts : posts
        };
        results_deferred.resolve(promise_value);
      });
    });

    return results_deferred.promise;
  };

  this.searchAuthors = function(query) {
    var authors_deferred = $q.defer(),
        results_deferred = $q.defer();

    //get all the authors and filter the ones with the query
    $http.jsonp(WORDPRESS_API_URL + 'get_author_index/' +
    '?callback=JSON_CALLBACK')
    .success(function(data) {
      var authors = _.filter(data.authors, function(author){
        return ((author.name.indexOf(query) > -1) || (author.nickname.indexOf(query) > -1) || (author.first_name.indexOf(query) > -1));
      });
      authors_deferred.resolve(authors);
    })
    .error(function(data) {
      authors_deferred.reject(data);
    });

    authors_deferred.promise.then(function(authors){
      //for each of the tags matching the query, bring the related posts
      var author_promises = _.map(authors, function(author){
        return $http.jsonp(WORDPRESS_API_URL + 'get_author_posts/' +
        '?id='+ author.id +
        '&callback=JSON_CALLBACK');
      });

      //prepare the response
      $q.all(author_promises).then(function(results){
        var posts = [];
        _.map(results, function(result){
          _.each(result.data.posts, function(post){
            posts.push(post);
          });
        });

        var promise_value = {
          id : "authors",
          posts : posts
        };
        results_deferred.resolve(promise_value);
      });
    });

    return results_deferred.promise;
  };
}])


// WP CATEGORIES RELATED FUNCTIONS
.service('CategoryService', ['$rootScope', '$http', '$q', 'WORDPRESS_API_URL', function ($rootScope, $http, $q, WORDPRESS_API_URL){

  this.getCategories = function() {
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'get_category_index/' +
    '?callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };
}])


// BOOKMARKS FUNCTIONS
.service('BookMarkService', ['_', function (_){
  this.bookmarkPost = function(bookmark_post){
    var user_bookmarks = !_.isUndefined(window.localStorage.ionWordpress_bookmarks) ? JSON.parse(window.localStorage.ionWordpress_bookmarks) : [];

    //check if this post is already saved
    var existing_post = _.find(user_bookmarks, function(post){ return post.id == bookmark_post.id; });

    if(!existing_post){
      user_bookmarks.push({
        id: bookmark_post.id,
        title : bookmark_post.title,
        date: bookmark_post.date,
        excerpt: bookmark_post.excerpt
      });
    }

    window.localStorage.ionWordpress_bookmarks = JSON.stringify(user_bookmarks);
  };

  this.getBookmarks = function(){
    return JSON.parse(window.localStorage.ionWordpress_bookmarks || '[]');
  };
}])


// PUSH NOTIFICATIONS
.service('PushNotificationsService', ['$rootScope', '$state', '$cordovaPush', 'WpPushServer', 'GCM_SENDER_ID', '$ionicHistory', function ($rootScope, $state, $cordovaPush, WpPushServer, GCM_SENDER_ID, $ionicHistory){
  /* Apple recommends you register your application for push notifications on the device every time it’s run since tokens can change. The documentation says: ‘By requesting the device token and passing it to the provider every time your application launches, you help to ensure that the provider has the current token for the device. If a user restores a backup to a device other than the one that the backup was created for (for example, the user migrates data to a new device), he or she must launch the application at least once for it to receive notifications again. If the user restores backup data to a new device or reinstalls the operating system, the device token changes. Moreover, never cache a device token and give that to your provider; always get the token from the system whenever you need it.’ */
  this.register = function() {
    if(ionic.Platform.isIOS())
    {
      var ios_config = {
        "badge": true,
        "sound": true,
        "alert": true
      };

      $cordovaPush.register(ios_config).then(function(result) {
        // Success -- send deviceToken to server, and store for future use
        console.log("Registration OK: " + result);
        WpPushServer.storeDeviceToken("ios", result);
      }, function(err) {
        console.log("Registration error: " + err);
      });

      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        console.log("Recieve push notification with notification.relatedvalue: " + notification.relatedvalue);

        if(notification.relatedvalue)
        {
          $ionicHistory.nextViewOptions({
            disableAnimate: true
          });
          $state.go("app.post", { postId: notification.relatedvalue });
        }
      });
    }
    else if(ionic.Platform.isAndroid())
    {
      var android_config = {
        "senderID": GCM_SENDER_ID // REPLACE THIS WITH YOURS FROM GCM CONSOLE
      };

      $cordovaPush.register(android_config).then(function(result) {
        // Success
        console.log("result: " + result);
      }, function(err) {
        // Error
        console.log("error: " + err);
      });

      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
        switch(notification.event)
        {
          case 'registered':
            if (notification.regid.length > 0 ) {
              WpPushServer.storeDeviceToken("android", notification.regid);
            }
            break;

          case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            console.log('message = ' + notification);

            if(notification.payload.relatedvalue)
            {
              $ionicHistory.nextViewOptions({
                disableAnimate: true
              });
              $state.go("app.post", { postId: notification.payload.relatedvalue });
            }
            break;

          case 'error':
            // alert('GCM error = ' + notification.msg);
            break;

          default:
            // alert('An unknown GCM event has occurred');
            break;
        }
      });
    }
  };
}])


// WP AUTHENTICATION RELATED FUNCTIONS
.service('AuthService', ['$rootScope', '$http', '$q', 'WORDPRESS_API_URL', function ($rootScope, $http, $q, WORDPRESS_API_URL){

  this.validateAuth = function(user) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/validate_auth_cookie/' +
    '?cookie='+ user.cookie +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.doLogin = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    authService.requestNonce("user", "generate_auth_cookie")
    .then(function(nonce){
      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      //now that we have the nonce, ask for the new cookie
      authService.generateAuthCookie(user.userName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          //recieve and store the user's cookie in the local storage
          var user = {
            cookie: data.cookie,
            data: data.user,
            user_id: data.user.id
          };

          authService.saveUser(user);

          //getavatar in full size
          authService.updateUserAvatar().then(function(){
            deferred.resolve(user);
          });
        }
      });
    });
    return deferred.promise;
  };

  this.doRegister = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    authService.requestNonce("user", "register")
    .then(function(nonce){
      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      authService.registerUser(user.userName, user.email,
        user.displayName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          // in order to get all user data we need to call this function
          // because the register does not provide user data
          authService.doLogin(user).then(function(){
            deferred.resolve(user);
          });
        }
      });
    });

    return deferred.promise;
  };

  this.requestNonce = function(controller, method) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'get_nonce/' +
    '?controller=' + controller +
    '&method=' + method +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data.nonce);
    })
    .error(function(data) {
      deferred.reject(data.nonce);
    });
    return deferred.promise;
  };

  this.doForgotPassword = function(username) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/retrieve_password/' +
    '?user_login='+ username +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.generateAuthCookie = function(username, password, nonce) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/generate_auth_cookie/' +
    '?username='+ username +
    '&password=' + password +
    '&nonce='+ nonce +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.saveUser = function(user){
    window.localStorage.ionWordpress_user = JSON.stringify(user);
  };

  this.getUser = function(){
    return {
      avatar : JSON.parse(window.localStorage.ionWordpress_user_avatar || null),
      data: JSON.parse(window.localStorage.ionWordpress_user || null).data,
      cookie: JSON.parse(window.localStorage.ionWordpress_user || null).cookie
    };
  };

  this.registerUser = function(username, email, displayName, password, nonce) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/register/' +
    '?username='+ username +
    '&email=' + email +
    '&display_name='+ displayName +
    '&user_pass=' + password +
    '&nonce='+ nonce +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.userIsLoggedIn = function(){
    var deferred = $q.defer();

    var user = JSON.parse(window.localStorage.ionWordpress_user || null);
    if(user !== null && user.cookie !== null)
    {
      this.validateAuth(user).then(function(data){
        deferred.resolve(data.valid);
      });
    }
    else
    {
      deferred.resolve(false);
    }
    return deferred.promise;
  };

  this.logOut = function(){
    //empty user data

    window.localStorage.ionWordpress_user = null;
    window.localStorage.ionWordpress_user_avatar = null;
    // window.localStorage.ionWordpress_bookmarks = null;
  };

  //update user avatar from WP
  this.updateUserAvatar = function() {
    var avatar_dfd = $q.defer(),
        authService = this,
        user = JSON.parse(window.localStorage.ionWordpress_user || null);

    $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
    '?user_id='+ user.user_id +
    '&type=full' +
    '&callback=JSON_CALLBACK')
    .success(function(data) {

      window.localStorage.ionWordpress_user_avatar =  JSON.stringify(data.avatar);

      avatar_dfd.resolve(data.avatar);
    })
    .error(function(err) {
      avatar_dfd.reject(err);
    });

    return avatar_dfd.promise;
  };
}])

;

angular.module('your_app_name.config', [])
.constant('WORDPRESS_API_URL', 'http://vivaz.easyfitnesswithjeannie.com/api/')
.constant('WORDPRESS_PUSH_URL', 'http://wordpress.startapplabs.com/blog/push/')
.constant('GCM_SENDER_ID', '574597432927')

;

angular.module('your_app_name.filters', [])

.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);

angular.module('your_app_name.factories', [])

// Factory for wordpress-pushserver http://codecanyon.net/item/send-mobile-push-notification-messages/6548533, if you are using other push notifications server you need to change this
.factory('WpPushServer', ['$http', 'WORDPRESS_PUSH_URL', function ($http, WORDPRESS_PUSH_URL){

  // Configure push notifications server address in  www/js/config.js

  return {
    // Stores the device token in a db
    // type:  Platform type (ios, android)
    storeDeviceToken: function(type, regId) {

      console.log("Stored token for registered device with data "+ 'device_token=' + regId + '&device_type='+ type);

      $http.post(WORDPRESS_PUSH_URL + 'savetoken/' +
        '?device_token=' + regId +
        '&device_type='+ type)
      .success(function (data, status) {
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error storing device token." + data + " " + status);
      });
    }
  };
}])


.factory('AdMob', ['$window', function ($window){
  var admob = $window.AdMob;

  if(admob)
  {
    // Register AdMob events
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('onAdFailLoad', function(data){
      console.log('error: ' + data.error +
      ', reason: ' + data.reason +
      ', adNetwork:' + data.adNetwork +
      ', adType:' + data.adType +
      ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
    });
    document.addEventListener('onAdLoaded', function(data){
      console.log('onAdLoaded: ' + data);
    });
    document.addEventListener('onAdPresent', function(data){
      console.log('onAdPresent: ' + data);
    });
    document.addEventListener('onAdLeaveApp', function(data){
      console.log('onAdLeaveApp: ' + data);
    });
    document.addEventListener('onAdDismiss', function(data){
      console.log('onAdDismiss: ' + data);
    });

    var defaultOptions = {
      // bannerId: admobid.banner,
      // interstitialId: admobid.interstitial,
      // adSize: 'SMART_BANNER',
      // width: integer, // valid when set adSize 'CUSTOM'
      // height: integer, // valid when set adSize 'CUSTOM'
      position: admob.AD_POSITION.BOTTOM_CENTER,
      // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
      bgColor: 'black', // color name, or '#RRGGBB'
      // x: integer,		// valid when set position to 0 / POS_XY
      // y: integer,		// valid when set position to 0 / POS_XY
      isTesting: true, // set to true, to receiving test ad for testing purpose
      // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
    };
    var admobid = {};

    if(ionic.Platform.isAndroid())
    {
      admobid = { // for Android
        banner: 'ca-app-pub-6869992474017983/9375997553',
        interstitial: 'ca-app-pub-6869992474017983/1657046752'
      };
    }

    if(ionic.Platform.isIOS())
    {
      admobid = { // for iOS
        banner: 'ca-app-pub-6869992474017983/4806197152',
        interstitial: 'ca-app-pub-6869992474017983/7563979554'
      };
    }

    admob.setOptions(defaultOptions);

    // Prepare the ad before showing it
    // 		- (for example at the beginning of a game level)
    admob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false,
      success: function(){
        console.log('interstitial prepared');
      },
      error: function(){
        console.log('failed to prepare interstitial');
      }
    });
  }
  else
  {
    console.log("No AdMob?");
  }

  return {
    showBanner: function() {
      if(admob)
      {
        admob.createBanner({
          adId:admobid.banner,
          position:admob.AD_POSITION.BOTTOM_CENTER,
          autoShow:true,
          success: function(){
            console.log('banner created');
          },
          error: function(){
            console.log('failed to create banner');
          }
        });
      }
    },
    showInterstitial: function() {
      if(admob)
      {
        // If you didn't prepare it before, you can show it like this
        // admob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});

        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        admob.showInterstitial();
      }
    },
    removeAds: function() {
      if(admob)
      {
        admob.removeBanner();
      }
    }
  };
}])

.factory('iAd', ['$window', function ($window){
  var iAd = $window.iAd;

  // preppare and load ad resource in background, e.g. at begining of game level
  if(iAd) {
    iAd.prepareInterstitial( { autoShow:false } );
  }
  else
  {
    console.log("No iAd?");
  }

  return {
    showBanner: function() {
      if(iAd)
      {
        // show a default banner at bottom
        iAd.createBanner({
          position:iAd.AD_POSITION.BOTTOM_CENTER,
          autoShow:true
        });
      }
    },
    showInterstitial: function() {
      // ** Notice: iAd interstitial Ad only supports iPad.
      if(iAd)
      {
        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        iAd.showInterstitial();
      }
    },
    removeAds: function() {
      if(iAd)
      {
        iAd.removeBanner();
      }
    }
  };
}])


;
