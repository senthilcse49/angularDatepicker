var myApp = angular.module("datepicker",[]);

myApp.value("eventBinded",false);



myApp.controller('con',['$scope','$http','$window','eventBinded',function($scope,$http,$window,eventBinded){
    $scope.elem;
    $scope.dpOpened = false;
    $scope.mouseIn = false;
    $scope.elemWidth;
    $scope.topX=0;
    $scope.leftY = 0;
    $scope.getData = function(){
        $scope.hideCalendar = true;
        $scope._format = "mm/dd/yyyy";
        $scope._startDate = 0;
        $scope._weekend= ["sat","sun"];
        $scope._days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        $scope.preStartOfMonth = [1,2,3,4,5];
        $scope.postEndOfMonth = [1,2,3,4,5];
        $scope.currentMonthDays = [1,2,3,4,5,6,7,8,9];
        
         
        $scope._months = [{text:"Jan",value:0},{text:"Feb",value:1},
            {text:"Mar",value:2},{text:"Apr",value:3},{text:"May",value:4}
            ,{text:"Jun",value:5},{text:"Jul",value:6},{text:"Aug",value:7}
            ,{text:"Sep",value:8},{text:"Oct",value:9},{text:"Nov",value:10},
            {text:"Dec",value:11}];
        $scope._todaysDate = new Date();
        $scope._editOption = true;
        $scope.selectedMonth = $scope._todaysDate.getMonth();
        $scope.selectedYear = $scope._todaysDate.getFullYear();
        
        
        $http({method:'get',url:("js/config.json")}).success(function(data,status){
           $scope._format = data[0].format || $scope._format;   
           $scope._startDate = data[0].startDate || $scope._startDate;
            $scope.getPrevDays($scope._startDate,$scope._todaysDate);     
            $scope._fixedWidth =  data[0].fixedWidth ||true ;
            $scope._elemWidth = data[0].elemWidth ||  "200px";
        });
        
        
        $scope.show = function(){
            if(!$scope.dpOpened){
               // $('.comDatePicker').hide();
                if(!$scope._fixedWidth)
                   $scope.elemWidth =                                  $($scope.elem).width()+"px";

                $scope.topX = $($scope.elem).position().top+$($scope.elem).outerHeight()+"px";
                 $scope.leftY = $($scope.elem).position().left+"px";
               //    $('body').bind('click',function(event){dp_windowClick($scope,event)});
                 $scope.$apply(function(){

                     $scope.hideCalendar = false;
                 });
                $scope.dpOpened = true;
            }
        };
        
        $scope.hide = function(){
            $scope.dpOpened = false;
           console.log("hide"); 
          //  $('body').unbind('click',function(event){dp_windowClick($scope,event)});
            $scope.$apply(function(){
                 $scope.hideCalendar = true;
             });
        }
        
        $scope.changeDP = function(){
            
           
            var tempDate = new Date();
            tempDate.setMonth($scope.selectedMonth);
            tempDate.setFullYear($scope.selectedYear);
            $($scope.elem).val(tempDate);
            $scope.getPrevDays(0,tempDate);
            
        }
        
        
        
        $scope.getPrevDays = function(num,_date){
           var tempDate = _date;
            tempDate.setDate(tempDate.getDate()+num);
           tempDate.setDate(1);
           var prevDays = tempDate.getDay();
           $scope.preStartOfMonth = [];
           for(var i=0;i<prevDays;i++){
                $scope.preStartOfMonth.push(i);
           }
           console.log(num +"  "+tempDate +"    "+tempDate.getDay());
           tempDate.setMonth(tempDate.getMonth()+1);
            
           var postDays = tempDate.getDay();
                   
            $scope.postEndOfMonth = [];    
           if(postDays != 0){ 
               postDays = 7 - postDays;        
               for(var i=0;i<postDays;i++){
                    $scope.postEndOfMonth.push(i);
               }
           }               
             console.log(postDays);
          
           console.log(tempDate +"    "+tempDate.getDay());
             tempDate.setDate(tempDate.getDate()-1);
           var noOfDays = tempDate.getDate();
            $scope.currentMonthDays = [];
           for(var i=1;i<=noOfDays;i++){
                $scope.currentMonthDays.push(i);
           }       
       //  console.log($scope.currentMonthDays +"   "+noOfDays); 
           // $scope.currentMonthDays.apply();
        }
        
        
        
         $scope.nextYear =function(){
             $scope.selectedYear += 1;
             $scope.changeDP();
         }
         
          $scope.prevYear =function(){
             $scope.selectedYear -= 1;
             $scope.changeDP();
         }
          
        $scope.nextMonth =function(){
            $scope.selectedMonth += 1;
            if($scope.selectedMonth > 11)
            {
                $scope.selectedMonth = 0;
                 $scope.selectedYear += 1; 
            }
            $scope.changeDP();
        }
        
        $scope.prevMonth =function(){
            
            $scope.selectedMonth -= 1;
            if($scope.selectedMonth < 0)
            {
                $scope.selectedMonth = 11;
                 $scope.selectedYear -= 1; 
            }
            $scope.changeDP();
        }
        
        $scope.hideOthers = function(){
            $('.comDatePicker').hide();
        }
        $scope.selectDate = function(day){
            console.log(day +"   day");
            var tempDate = new Date($scope.selectedYear,$scope.selectedMonth,day);
            
            $($scope.elem).val(tempDate.toLocaleDateString("en-US"))
            $($scope.elem).triggerHandler('input');
            $($scope.elem).triggerHandler('change');
             
                 $scope.hideCalendar = true;
            
        }
       
     
        $scope.bindEvent = function(){
            if(!eventBinded){
                 $($window).bind('click',function(event){
                     console.log("  event "+event.target);
                    if(!$(event.target).attr("class") )
                        $scope.hide();
                    if($(event.target).attr("class") && $(event.target).attr("class").indexOf('dp_cal_inp_ng_scope') == -1){
                       
                        $scope.hide();
                    }
                });
            }   
        }
    }
}]);






myApp.directive('datepicker',['$compile','$window',function($compile,$window){
    return{
        restrict:'E',
        replace:true,
       
        
        terminal:true,
         
        controller:'con',
        link:function($scope,$elem,$attr){
            var inputElem =  $elem.find('input')[0], 
            dpTemplate = "<div class='comDatePicker dp_cal_inp_ng_scope' ng-hide='hideCalendar'  ng-style='{\"top\":topX,left:leftY}'>";
        
            /*start of DatePciker Header*/
            dpTemplate += "<div class='comDPHeader dp_cal_inp_ng_scope'>";
            dpTemplate += "<div class='comDPHMonth dp_cal_inp_ng_scope' ><label class='dp_cal_inp_ng_scope' ng-click='prevMonth()'><</label>&nbsp;<label class='dp_cal_inp_ng_scope' ng-click='nextMonth()'>></label>&nbsp;";
            dpTemplate +="<select class='dp_cal_inp_ng_scope' ng-model='selectedMonth'";
            dpTemplate += "ng-options='month.value as month.text for month in _months' ng-change='changeDP()'></select> ";
            dpTemplate += "<div class='comDPHYear dp_cal_inp_ng_scope'><label class='dp_cal_inp_ng_scope'>{{selectedYear}}</label>";
            dpTemplate += " <input  ng-hide='_editOption' ng-model='selectedYear'>";
            dpTemplate += "<label class='dp_cal_inp_ng_scope' ng-click='prevYear()'><</label>&nbsp;<label ng-click='nextYear()' class='dp_cal_inp_ng_scope'>></label>&nbsp;";
            
            dpTemplate += "</div>";
            /*end of DatePciker Header*/
            
            //Days Header
            dpTemplate += "<div class='daysHeader dp_cal_inp_ng_scope'><label class='dp_cal_inp_ng_scope dayHeader' ng-repeat='day in _days'>{{day}}</label></div>";
            
            
            /*start of the datepicker part*/
            dpTemplate += "<div class='dp_cal_inp_ng_scope days'><a class='dp_cal_inp_ng_scope' ng-repeat='preDay in preStartOfMonth ' disabled>&nbsp;</a>";
            dpTemplate += "<a href='#' class='dp_cal_inp_ng_scope' ng-repeat='day in currentMonthDays' ng-click='selectDate(day)'>{{day}}</a>";
            dpTemplate += "<a class='dp_cal_inp_ng_scope' ng-repeat='preDay in postEndOfMonth ' disabled>&nbsp;</a>";
            dpTemplate += "</div>";
            
            dpTemplate += "</div>";
            $scope.elem = inputElem;
            $(inputElem).addClass("dp_cal_inp_ng_scope");
            $scope.getData();
            $(inputElem).after($compile(angular.element(dpTemplate))($scope)); 
            $(inputElem).bind('click focus',function(){
                
                $scope.show();
                
            });
            $(inputElem).bind('blur',function(){
                
               // $scope.hide();
                
            });
           $scope.bindEvent();
          
        } 
    }
}]);




