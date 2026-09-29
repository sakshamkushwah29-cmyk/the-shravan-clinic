/*function resetMessageBoxes() {
    $('.messageBox').removeClass('alert');
    $('.messageBox').val('');
}
function showErrorMessage(elem, message) {
    elem.text(message);
    elem.addClass('alert');
}*/
function imageExists(imageSrc) {
    return new Promise(function(resolve,reject){
        var img = new Image();
        img.src = imageSrc;
        img.onload = resolve;
        img.onerror = reject;
    })
}

function showPopUpMessage(type, title, message) {
    $("#" + type + '-popupTitle').html(title);
    $("#" + type + '-popupContent').html(message);
    $("#" + type).fadeIn(200);
}
function getFormData(selector, fieldNameSelector = "id", messageType = "formMessage") {
    var returnArray = {};
    $('.messageBox').removeClass('alert');
    $(selector).each(function () {
        var elem = $(this);
        var data = elem.val();
        var field = elem.attr(fieldNameSelector);
        var messageBox = elem.closest('.inputDiv').find('.messageBox');
        if (hasAttr(elem, 'required') && (data == '' || data == null)) {
            if (messageType == "formMessage") {
            // showErrorMessage(messageBox, "please enter value");
            } else if (messageType == "popupMessage") {
                showPopUp('error', 'Error!', "Please enter value for " + field);
            }
         throw new Error("required data missing - "+field+" - "+data);
            return false;
        }
        returnArray[field] = data;
    });
    return returnArray;
}
function processAjaxReturnData(retrunDataJSON, func) {
    //{success :"", authorization : "", validation : "", error : ""}
    try {
        var returnData = JSON.parse(retrunDataJSON);
        var response = returnData.response;
        var ajaxReturnData = ('data' in returnData) ? returnData.data : '';
        var ajaxReturnMessage = ('message' in returnData) ? returnData.message : 'Some error occured';
        if (response == 200) {
            if (typeof func.success == "function") {
                func.success(ajaxReturnData);
            }
        } else if (response == 417) {
            if (typeof func.validation == "function") {
                func.validation(returnData);
            } else {
                showPopUp('error', 'Error!', "Invalid data");
            }
        } else if (response == 107) {
            if (typeof func.loginFailure == "function") {
                func.loginFailure(returnData);
            } else {
                showPopUp('error', 'Error!', "Invalid email or password");
            }
        } else if (response == 105) {
            if (typeof func.userNotExists == "function") {
                func.userNotExists(returnData);
            } else {
                showPopUp('error', 'Error!', "User not exists");
            }
        } else if (response == 106) {
            if (typeof func.userExists == "function") {
                func.userExists(returnData);
            } else {
                showPopUp('error', 'Error!', "User exists");
            }
        } else if (response == 109) {
            if (typeof func.maxLogins == "function") {
                func.userExists(returnData);
            } else {
                showPopUp('error', 'Error!',"You have reachec maximum number of logins possible. Please logout from one of the device to proceed");
            }
        }else if (response == 401) {
            if (typeof func.authorization == "function") {
                func.authorization(returnData);
            } else {
                showPopUp('error', 'Error!', "You are not authorized");
            }
        } else {
            if (typeof func.error == "function") {
                func.error(returnData);
            } else {
                showPopUp('error', 'Error!', ajaxReturnMessage);
            }
        }
    } catch (err) {
        console.log(err);
    }


}

function hasAttr(elem, attribute) {
    var attr = $(elem).attr(attribute);
    if (typeof attr !== 'undefined' && attr !== false) {
        return true;
    } else {
        return false;
    }
}
$("[mobile-10]").on('blur', function (e) {
    e.preventDefault();
    var elem = $(this);
    elem.closest(".inputGroupDiv").find(".messageArea").text("");
    var value = $(this).val();
    if (value != "") {
        if (!value.match('[1-9]{1}[0-9]{9}')) {
            elem.closest(".inputGroupDiv").find(".messageArea").text("Please enter 10 digit mobile number");
            elem.val('');
            elem.focus();
            return false;
        }
    }

});
$("input[type='email']").on('blur', function (e) {
    e.preventDefault();
    var elem = $(this);
    elem.closest(".inputGroupDiv").find(".messageArea").text("");
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var value = elem.val();
    if (value != "") {
        if (reg.test(value) == false)
        {
            elem.closest(".inputGroupDiv").find(".messageArea").text("Invalid Email Address");
            elem.val('');
            elem.focus();
            return false;
        }
    }
});

function enableTableRowEdit(event) {
    var elem = $(event.target);
    var row = elem.closest('tr');
    var rowid = row.attr('editrowid');
    if ($('tr.underEditing').length){
        showPopUp('error', 'Error!', 'Please finish acting editing to start another editing');
        return false;
    }
    row.addClass('underEditing');
    row.find('td[editable]').each(function () {
        var key = $(this).attr('key');
        var input = $(this).attr('input');

        var value = $(this).text();
        var required = $(this).attr('required');
        var html = "";
        if (input == 'text') {
            html = `<input type="text" class="editRowInput"  key="${key}" ${required} value="${value}" editrowid="${rowid}"/>`;
        } else if (input == 'hidden') {
            html = `<input type="hidden" class="editRowInput"  key="${key}" ${required} value="${value}" editrowid="${rowid}"/>`;
        } else if (input == 'textarea') {
            html = `<textarea class="editRowInput"  key="${key}" ${required} editrowid="${rowid}">${value}</textarea>`;
        }
        $(this).html(html);
    });
    elem.hide();
    row.find('.updateBt').show('fast');
    row.find('.cancelBt').show('fast');
}

function cancelRowEdit(event) {
    var elem = $(event.target);
    var row = elem.closest('tr');
    row.removeClass('underEditing');
    row.find('td[editable]').each(function () {
        var value = $(this).find(".editRowInput").val();
        $(this).html(value);
    });
    elem.hide('fast');
    row.find('.updateBt').hide('fast');
    row.find('.editBt').fadeIn('fast');
}

function removeTableRowEditField(elem) {
    var row = elem.closest('tr');
    row.removeClass('underEditing');
    row.find('td[editable]').each(function () {
        var value = $(this).find(".editRowInput").val();
        $(this).html(value);
    });
    elem.hide('fast');
    row.find('.cancelBt').hide('fast');
    row.find('.editBt').fadeIn('fast');
}
$(document).ready(function () {
    if ($('#myTable').length)
    {
        window['datatable'] = $('#myTable').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'excelHtml5',
                'colvis'
            ]
        });
    }

});
$('textarea').on('input', function () {
    var elem = $(this);
    elem.style.height = "5px";
    elem.style.height = (elem.scrollHeight) + "px";
});
function refreshPageArea(areaSelector) {
    $(areaSelector).load(location.href + " " + areaSelector);
}

function changeStatus(event, item = "", status = "") {
    event.preventDefault();
    var elem = $(event.target);
    var url = elem.attr('href');
    var rowId = elem.closest('tr').attr('editrowid');
    $.post(url).done(function (result) {
        processAjaxReturnData(result, {
            success: function (returnData) {
                showPopUp('success', 'Success!', item + ' status changed to ' + status);
                setTimeout(function () {
                    location.reload();
                }, 1300);
            }
        });
    });
}
function validate(formSelect , requiredAttr, messageElem) {
    formSelect= formSelect || ""
    requiredAttr=requiredAttr || "[required]"
    messageElem=messageElem ||".messageArea"
    $(messageElem).html('');
    var bool = true;
    var sel = formSelect + " "+requiredAttr;
    $(formSelect).find(requiredAttr).each(function () {
        var elem = $(this);
        if (elem.val() == '') {
            var field = elem.attr("id");
            var txt = "Please enter " + field;
            elem.closest(".inputGroupDiv").find(messageElem).text(txt);
            elem.focus();
            bool = false;
            return false;
        }
    });
    return bool;
}
function checkForEmptyInputsBySelector(selector) {
    selector.each(function () {
        var elem = $(this);
        console.log(elem);
        if (elem.val() === '') {
            elem.closest('.inputGroup').find(".messageDiv").text("Please fill here");
            return false;
        }
    });
    return true;
}


$(document).ready(function () {
        $('.mobile-valid').on('keyup', function (e) {
            var data = $(this).val();
            if(data.length > 10){
                data = data.slice(0, 9); 
                $(this).val(data);
            }
            if(!Number.isInteger(data)){
                var newVal = parseInt(data);
                if(newVal >= 0){
                    $(this).val(newVal);
                }else{
                    $(this).val('');
                }
            }
        });
   });
