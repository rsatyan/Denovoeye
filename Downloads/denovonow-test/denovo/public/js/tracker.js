var addCardAnimation = function(questionid) {
  $('.'+questionid+'card').addClass('animated tada')
}

var signUpForBenefit = function(benefitID) {
  // post /benefit/signup
  //alert(benefitID)
  $.ajax({
    url: '/benefit/signup?benefitID='+benefitID,
    type: 'POST',
    beforeSend:function(){
        $(".ajaxLoader").show();
    },
    complete:function(){
      $(".ajaxLoader").hide();
    },
    success: function(response) {
      location.reload(false);
    }
  });
 }

var generateIndexOfDateForCard = function(cardid) {
  var index = -1
  var elementID = cardid+'-date-selector'
  $('#'+elementID).children().each(function(idx){
    if ($(this).hasClass('sel')) index  = idx
  }) 
  return index
}

var returnTimeStampForIndex = function(index) {
  var day = new Date()
  day.setDate(day.getDate() - (6 - index))
  return day.getTime()
}


var addcheckMarkToQuestion = function (elementId) {
  var id = '#'+elementId+'-checkMark'
  $(id).addClass("approved");
  $(id).html('<span class="skill-done">T</span>')
}

var resetCheckMarkForQuestion = function(elementId) {

  $.get("/trackresult/"+elementId+"/point",function(data){
    var point = 0
    if(data.success) point = data.point
    
    var id = '#'+elementId+'-checkMark'
    $(id).removeClass("approved")
    $(id).html('<span class="skill-text">+'+point+'</span>')

  });
}

var trackQuestionResponseForDay = function(questionID,timestamp) {

  $.get("/trackQuestion?questionID="+questionID+"&timestamp="+timestamp,function(data){
        //alert("data: questionid = " +data.questionId+", success: "+data.success)
    if (data.success == true) {
      addcheckMarkToQuestion(data.questionId)
    } else {
      resetCheckMarkForQuestion(data.questionId)
    }
  }, "json");

}

var daysTrackedForQuestion = function(questionID){

  $.get("/trackresult/"+questionID+"/daycount",function(data){
        //alert("data: questionid = " +data.questionId+", success: "+data.success)
    if (data.success == true) {
      $('#'+questionID+'-days-text').text('Tracked '+data.count+' day(s)')
    }
  }, "json");

}

var daysTrackedForChallenge = function(challengeID){
  $.get("/challengetracker/"+challengeID+"/daycount",function(data){
        //alert("data: questionid = " +data.questionId+", success: "+data.success)
    if (data.success == true) {
      $('#'+challengeID+'-days-text').text('Tracked '+data.count+' day(s)')
    }
  }, "json");
}


var changelevel = function(level) {
  $.ajax({
    url: '/updateLevel?level='+level,
    type: 'PUT',
    beforeSend:function(){
        $(".ajaxLoader").show();
    },
    complete:function(){
      $(".ajaxLoader").hide();
    },
    success: function(response) {
      location.reload(false);
    }
  });
}

var dateSwitched = function(span) {
  $(span).parent().children('.sel').removeClass('sel')
  $(span).addClass('sel')

  var parentID = $(span).parent().attr("id")
  var elementid = parentID.replace("-date-selector","")
  var index = generateIndexOfDateForCard(elementid)
  var timestamp = returnTimeStampForIndex(index)
  // question
  if ($(span).parent().hasClass("question"))   trackQuestionResponseForDay(elementid,timestamp)

}

var onChallengeCompleteClick = function(elementId) {
    ///userchallenges/:id/completed
  var challengeId = elementId.replace("-complete","")
  addCardAnimation(challengeId) 
  
  $.ajax({
    url: '/userchallenges/'+challengeId+'/completed',
    type: 'PUT',
    beforeSend:function(){
      $(".ajaxLoader").show();
    },
    complete:function(){
      $(".ajaxLoader").hide();
    },
    success: function(response) {
      location.reload(false);
    }
  });
}

var trackChallenge = function(elementId) {
  var challengeId = elementId.replace("-done","") 
  addCardAnimation(challengeId) 
      
  // /challengetracker
  $.post("/challengetracker?challengeID="+challengeId,function(data){
    daysTrackedForChallenge(challengeId)
  }, "json");
}

var updateStat = function() {
  $.get("/userpoints",function(data){
    $('#totalpoints').text(''+data.totalPoints)
    $('#pointsForMonth').text(''+data.pointsForLastMonth)
    $('#pointsForWeek').text(''+data.pointsForLastWeek)
    $('#pointsForToday').text(''+data.pointsForToday)
  }, "json");
}

var trackQuestion = function(obj){
  $.post("/trackresult",obj,function(data){
    updateStat()
    addcheckMarkToQuestion(obj.question_id)
  }, "json");
}

var clearAllInputs = function(parentElement) {

  $(parentElement).find('select').each(function(index,selector){
    $(selector.options[0]).attr('selected',true)
  })

  $(parentElement).find('input').each(function(index,element){
    $(element).val("")
  })
}

var getAllInput = function (parentElement,result) {
  var isEmpty = false
    // find all inputs from select element
  $(parentElement).find('select').each(function(index,selector){
    if (selector.selectedIndex == 0)  return isEmpty;
    var elementId = selector.options[selector.selectedIndex].id
    var arr = elementId.split(" ")
    var option = [arr[1],arr[2],arr[3]];
    result.push(option)
  })

  $(parentElement).find('input').each(function(index,element){
    if ($(element).val() === '') {
      return isEmpty = true
    } else {
      var arr = element.id.split(" ")
      var option = [arr[1],[arr[2],$(element).val()],arr[3]]
      result.push(option)
    }
  })
  
  return isEmpty;
}

var onTextFieldInput = function(elementId) {
  var arr = elementId.split(" ")
  
      // [optionID,[itemID,value],point]
  var option = [arr[1],[arr[2],$('#'+elementId).val()],arr[3]]
  var obj = null
  var result = []
  result.push(option)
  
  var index = generateIndexOfDateForCard(arr[0])

  var parentDiv = $('#'+elementId).parent()
  if (!getAllInput(parentDiv,result)) {
    addCardAnimation(arr[0])
    obj = {
      "question_id": arr[0],
      "result" : result,
      "timestamp" : returnTimeStampForIndex(index)
    };
    trackQuestion(obj)
    clearAllInputs(parentDiv)
  }
}

var onOptionSelected = function(selector) {
  var optionElementId = selector.options[selector.selectedIndex].id
  var arr = optionElementId.split(" ")
  
  var obj = null
  var optionSelected = [arr[1],arr[2],arr[3]];
  var result = []
  result.push(optionSelected)
  var parentDiv = $(selector).parent()

  var index = generateIndexOfDateForCard(arr[0])

  if (!getAllInput(parentDiv,result)) {
    addCardAnimation(arr[0])
    obj = {
      "question_id": arr[0],
      "result" : result,
      "timestamp" : returnTimeStampForIndex(index)
    };
    trackQuestion(obj)
    clearAllInputs(parentDiv)
  }
}

var onOptionClicked = function(buttonId) {
    //<%=question.id.toString()%>card
  var arr = buttonId.split(" ")
  addCardAnimation(arr[0])
  var obj = null
  var results = [arr[1],arr[2],arr[3]];

  var index = generateIndexOfDateForCard(arr[0]) 

  obj = {
    "question_id": arr[0],
    "result" : [results],
    "timestamp" : returnTimeStampForIndex(index)
  };
  
  trackQuestion(obj)
}

var updateQuestions = function(questionsArray) {
  var now = new Date()
  for (var i=0; i < questionsArray.length; i++) {
    trackQuestionResponseForDay(questionsArray[i].id.toString(),now.getTime())
    daysTrackedForQuestion(questionsArray[i].id.toString())
  }
}

var updateChallenges = function(challenges) {
  for (var j=0; j < challenges.length; j++) {
    var currentChallenge = challenges[j]
    daysTrackedForChallenge(currentChallenge.challengeId)
  }
}

var bindTextFieldInputs = function() {
  $('.input').each(function(index){
    $(this).keypress(function(e){
      var evt =  e || window.event
      var code = (e.keyCode ? e.keyCode : e.which);
      if(code === 13) {
          // alert(this.id + ','+this.value+";")
        onTextFieldInput(this.id)
      }  
    })
  })
}