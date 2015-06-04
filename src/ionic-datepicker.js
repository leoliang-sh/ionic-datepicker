//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

"use strict";
angular.module('ionic-datepicker', ['ionic', 'ionic-datepicker.templates'])

  .directive('ionicDatepicker', ['$ionicPopup', function ($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,//替换元素
      scope: {
        ipDate: '=idate'//绑定idate中的变量
      },
      link: function (scope, element, attrs) {
        var monthsList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月",
          "八月", "九月", "十月", "十一月", "十二月"];

        var currentDate = angular.copy(scope.ipDate);//深拷贝一份变量
        scope.weekNames = ['日', '一', '二', '三', '四', '五', '六'];

        //生成今天的信息
        scope.today = {};
        scope.today.dateObj = new Date();
        scope.today.date = (new Date()).getDate();
        scope.today.month = (new Date()).getMonth();
        scope.today.year = (new Date()).getFullYear();

        var refreshDateList = function (current_date) {
          //更新当前天数
          scope.selctedDateString = (new Date(current_date)).toString();
          currentDate = angular.copy(current_date);

          //获取当前月的第一天和最后一天
          var firstDay = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDate();
          var lastDay = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();

          //生成日期的list
          //datyList中的item结构如下：
          //{
          //  date,
          //  month,
          //  year,
          //  day,
          //  dateString,
          //  epochLocal,
          //  epochUTC
          //}
          scope.dayList = [];

          for (var i = firstDay; i <= lastDay; i++) {
            var tempDate = new Date(current_date.getFullYear(), current_date.getMonth(), i);
            scope.dayList.push({
              date: tempDate.getDate(),//日
              month: tempDate.getMonth(),//月
              year: tempDate.getFullYear(),//年
              day: tempDate.getDay(),//星期
              dateString: tempDate.toString(),
              epochLocal: tempDate.getTime(),
              epochUTC: (tempDate.getTime() + (tempDate.getTimezoneOffset() * 60 * 1000))
            });
          }

          var firstDay = scope.dayList[0].day;
          //第一天偏移
          for (var j = 0; j < firstDay; j++) {
            scope.dayList.unshift({});
          }

          scope.rows = [];
          scope.cols = [];

          scope.currentMonth = monthsList[current_date.getMonth()];//当前月
          scope.currentYear = current_date.getFullYear();//当前年

          scope.numColumns = 7;
          scope.rows.length = 6;
          scope.cols.length = scope.numColumns;

          if(currentDate){
            scope.date_selection.selected=true;
            scope.date_selection.selectedDate=angular.copy(currentDate);
          }

        };

        scope.prevMonth = function () {
          if (currentDate.getMonth() === 1) {
            currentDate.setFullYear(currentDate.getFullYear());
          }
          currentDate.setMonth(currentDate.getMonth() - 1);

          scope.currentMonth = monthsList[currentDate.getMonth()];
          scope.currentYear = currentDate.getFullYear();

          refreshDateList(currentDate)
        };

        scope.nextMonth = function () {
          if (currentDate.getMonth() === 11) {
            currentDate.setFullYear(currentDate.getFullYear());
          }
          currentDate.setMonth(currentDate.getMonth() + 1);

          scope.currentMonth = monthsList[currentDate.getMonth()];
          scope.currentYear = currentDate.getFullYear();

          refreshDateList(currentDate)
        };

        scope.date_selection = {selected: scope.ipDate?true:false, selectedDate: scope.ipDate, submitted: false};

        scope.dateSelected = function (date) {
          scope.selctedDateString = date.dateString;
          scope.date_selection.selected = true;
          scope.date_selection.selectedDate = new Date(date.dateString);
        };

        element.on("click", function () {
          if (!scope.ipDate) {
            var defaultDate = new Date();
            refreshDateList(defaultDate);
          } else {
            refreshDateList(angular.copy(scope.ipDate));
          }

          $ionicPopup.show({
            cssClass:'ionic-datepicker',
            templateUrl: 'date-picker-modal.html',
            title: '<strong>选择日期</strong>',
            subTitle: '',
            scope: scope,
            buttons: [
              {text: '关闭'},
              {
                text: '今天',
                onTap: function (e) {
                  refreshDateList(new Date());
                  e.preventDefault();
                }
              },
              {
                text: '设置',
                type: 'button-positive',
                onTap: function (e) {
                  scope.date_selection.submitted = true;

                  if (scope.date_selection.selected === true) {
                    scope.ipDate = angular.copy(scope.date_selection.selectedDate);
                  } else {
                    e.preventDefault();
                  }
                }
              }
            ]
          });
        });
      }
    }
  }]);