"use strict";

function app() {

    // for changing class of icons for tooltips
    this.width = ko.observable($(window).width());
    $(window).resize(function () {
        this.width($(window).width());
    }.bind(this));
    this.computedWidth = ko.computed(function () {
        var width = this.width();
        if(width<900){
            $("#back").addClass("transperent");
        }
        else{
            $("#back").removeClass("transperent");
        }
        $("#navigation-bar a").each(function () {
            $(this).removeAttr("class");
            $(this).addClass(width < 900 ? 'hint--bottom' : 'hint--right');
        });

    }.bind(this));

    changeCurrent();

    //Get the articles
    this.articles = ko.observableArray();
    this.topArticles = ko.observableArray();
    
    getArticles().then(function (data) {
       this.articles(data);
        this.topArticles(getTop3Articles(data));

    }.bind(this));


    //Options for the panel with more details about an article
    this.data = ko.observable();
    this.hasMoreDetails =ko.observable(false);
    this.moreData = ko.computed(function () {
        return this.hasMoreDetails() ? this.data() : null;
    }.bind(this));
    this.openMoreDetails = function (data) {
        this.hasMoreDetails(!this.hasMoreDetails());
        this.data(data);
    }.bind(this);
    this.closeMoreDetails =function () {
        this.hasMoreDetails(false);
    }.bind(this);


    // Options for tha dialog for adding new Article
    this.isOpenedPanel = ko.observable(false);
    this.addVM = ko.computed(function () {
        return this.isOpenedPanel() ? new AddPanelVM() : null;
    }.bind(this));

    this.addArticle  = function () {
        this.isOpenedPanel(!this.isOpenedPanel());
    };
    this.closePanel = function () {
        this.isOpenedPanel(false);
    }.bind(this);
    this.uploadArticle = function () {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "post.php", true);
        httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        httpRequest.onreadystatechange = function() {
            if(httpRequest.readyState == 4 && httpRequest.status == 200) {
                var return_data = httpRequest.responseText;

                getArticles().then(function (data) {
                    this.articles(data);
                }.bind(this));
                this.isOpenedPanel(null);
            }
        }.bind(this);
        var data = {
            title: this.addVM().name(),
            description: this.addVM().description(),
            location: this.addVM().location(),
            url: this.addVM().url()
        };
        httpRequest.send("data="+JSON.stringify(data) );

    }.bind(this);
}

function AddPanelVM() {
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.location = ko.observable("");
    // this.rating = ko.observable(0);
    this.url = ko.observable("");

    this.name.extend({required: true, maxLength:32});
    this.description.extend({ maxLength:200});
    this.location.extend({ maxLength:50});
    this.url.extend({required: true, pattern: "^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*‌​)*(\/?)([a-zA-Z0-9\-‌​\.\?\,\'\/\\\+&amp;%‌​\$#_]*)?$"});

    this.isValidCSS = function (el) {
      return !el.isValid() ? 'validationMessage' : '';
    }

    this.isValidRequest  = ko.computed(function () {
        return !!this.name()&& !!this.url();
    },this);
}

function getRequest(url) {

    return $.Deferred(function (dfd) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.send();
        httpRequest.onload = function () {
            dfd.resolve(httpRequest.responseText);
        }

    }).promise();
};

function getArticles() {

    return getRequest("articles.txt").then(function(result) {

        var arr = [];
        arr.push.apply(arr, result.split("\n"));

        for (var i = 0; i < arr.length; i++) {
            arr[i] = JSON.parse(arr[i]);
        }
        return arr;
    }.bind(this));
}

function changeCurrent() {
    $(window).on('scroll', function() {
        var homeHeight = $('#home').innerHeight();
        var destinationsHeight = $('#destinations').innerHeight();
        var aboutHeight = $('#about').innerHeight();
        if($(this).scrollTop()>=0){
            $('span').removeClass('current');
            $('a[href="#home"] span').addClass("current");
        }
        if($(this).scrollTop()> homeHeight ){
            $('span').removeClass('current');
            $('a[href="#destinations"] span').addClass("current");
        }
        if($(this).scrollTop()> homeHeight + destinationsHeight){
            $('span').removeClass('current');
            $('a[href="#about"] span').addClass("current");
        }
        if($(this).scrollTop()>homeHeight+destinationsHeight + aboutHeight){
            $('span').removeClass('current');
            $('a[href="#contacts"] span').addClass("current");
        }
    });
}

function getTop3Articles(array){
    var tempArr = [];
    for (var i = 0; i < array.length; i++) {
        if(i < 3){
            tempArr.push(array[i]);
        }else{
            break;
        }
    }
    return tempArr;
}
ko.applyBindings(new app);



function Person(fname,lname){
    this.fname = fname;
    this.lname = lname;

    this.hello = function () {
        console.log("Hello " + this.fname + " " + this.lname);
    }.bind(this);
}


var a = new Person("Monika", "Gerova");
a.hello();