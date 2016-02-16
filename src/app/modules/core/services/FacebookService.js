'use strict';

/**
 * @ngdoc object
 * @name core.Services.cardService
 * @description cardService
 */
angular
    .module('core')
    .factory('FacebookService', ['FlipConstants','$rootScope','$q','ProfileService',
        function(FlipConstants, $rootScope,$q,ProfileService) {
            function setUser(userData){
                 localStorage.setItem(FlipConstants.localStorage.facebookUser, JSON.stringify(userData));
            }
            function getProfileInfo(){
                 return _.result(JSON.parse(localStorage.getItem(FlipConstants.localStorage.facebookUser)),'profileInfo',{});
            }
            function getAuthResponse(){
                 return _.result(JSON.parse(localStorage.getItem(FlipConstants.localStorage.facebookUser)),'authResponse',{});
            }
            function setFacebookModal(date){
                 localStorage.setItem(FlipConstants.localStorage.facebookModalDate, date);
            }
            function showFacebookModal(){
                var lastShow = new Date(localStorage.getItem(FlipConstants.localStorage.facebookModalDate));
                var current = new Date();
                lastShow.setDate(lastShow.getDate() + 10);
                return lastShow.getTime() <= current.getTime();
            }
            function isConnectedFacebook(){
                if (!window.cordova) {
                    facebookConnectPlugin.browserInit(FlipConstants.FACEBOOK_APP_ID);
                }
                facebookConnectPlugin.getLoginStatus(function(success){
                    if(success.status === 'connected'){
                        var profileInfo= getProfileInfo();
                        $rootScope.userName = _.result(profileInfo,'first_name','Log in'); //jshint ignore:line
                        $rootScope.userImg = _.result(profileInfo,'picture.data.url',''); 
                        $rootScope.isConnected = true;
                        $rootScope.showFacebookLogin = false;
                        $rootScope.$apply();
                    }
                    else{
                        $rootScope.isConnected = false;
                        if(showFacebookModal()){
                            $rootScope.showFacebookLogin = true;
                            setFacebookModal(new Date().toDateString());
                        }
                    }
                },function(){
                    $rootScope.isConnected =false;
                });
            }
            function loginFacebook(){
                if (!$rootScope.isConnected) {
                    facebookConnectPlugin.login(['public_profile', 'user_friends'], fbLoginSuccess, function(){});
                }
            }
            function fbLoginSuccess(response){
                if (!response.authResponse){
                  return;
                }
                $rootScope.showFacebookLogin = false;
                $rootScope.isConnected =true;

                var authResponse = response.authResponse;
                facebookConnectPlugin.api('/me?fields=scores,picture,name,first_name,friends&access_token=' + authResponse.accessToken, null,
                  function (profileInfo) {
                    var giftGen = FlipConstants.gift[ProfileService.generateGift()];
                    $rootScope.giftFacebook = giftGen.slug;
                    ProfileService.propertyIncrement(giftGen.localStorage);

                    $rootScope.userName = _.result(profileInfo,'first_name','Log in'); //jshint ignore:line
                    $rootScope.userImg = _.result(profileInfo,'picture.data.url',''); 

                    setUser({
                        authResponse : authResponse,
                        profileInfo : profileInfo
                    });
                  }, function () {});
            }
            function shareFacebook(content){
                if (!$rootScope.isConnected) {
                    facebookConnectPlugin.login(['public_profile', 'user_friends'], function(response){
                        fbLoginSuccess(response);
                        showShareDialog(content);
                    }, function(){});
                }
                else{      
                    showShareDialog(content);
                }

            } 
            function showShareDialog(content){
                    facebookConnectPlugin.showDialog(
                    {
                      method: 'feed',
                      picture: FlipConstants.sharePicture,
                      name: content.name,
                      caption: content.caption,
                      description: content.description,
                      link:'https://apps.facebook.com/710594159019157/?fb_source=feed'
                    },function(){},function(){}); 
            }
            function inviteFriendsFacebook(){
                if (!$rootScope.isConnected) {
                    facebookConnectPlugin.login(['public_profile', 'user_friends'], function(response){
                        fbLoginSuccess(response);
                        inviteFriends();
                    }, function(){});
                }
                else{      
                        inviteFriends();
                }

            } 
            function inviteFriends(){
                    facebookConnectPlugin.showDialog(
                    {
                      method: 'apprequests',
                      message:'I invite you to play this nice a game'
                    },function(){},function(){}); 
            }
            return {
                setUser   : setUser,
                getProfileInfo   : getProfileInfo,
                getAuthResponse   : getAuthResponse,
                setFacebookModal   : setFacebookModal,
                showFacebookModal   : showFacebookModal,
                isConnectedFacebook   : isConnectedFacebook,
                loginFacebook: loginFacebook,
                shareFacebook:shareFacebook,
                inviteFriendsFacebook:inviteFriendsFacebook
            };
        }
    ]);