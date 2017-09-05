
function openTab(tab){
  $('.left_col').css('display', 'none');
  $('#' + tab).css('display', 'inline-block');
}

function makeActive(button){
  $('.item').removeClass('active');
  button.classList.add('active');
}

document.getElementById('pasted_text').onkeyup = function () {
    if ($('#pasted_text').val().length === 0){
      $('#annotate_submit_label').addClass('disabled');
      $('#annotate_submit_label').removeClass('basic');
    } else{
      $('#annotate_submit_label').removeClass('disabled');
      $('#annotate_submit_label').addClass('basic');
    }
};

function get_pos_color(pos){
  var color_dict = {};

  color_dict['AB'] = '#730000';
  color_dict['DT'] = '#e53939';
  color_dict['HA'] = '#663333';
  color_dict['HD'] = '#ffa280';
  color_dict['HP'] = '#f2c6b6';
  color_dict['HS'] = '#662900';
  color_dict['IE'] = '#a67453';
  color_dict['IN'] = '#f28100';
  color_dict['JJ'] = '#33271a';
  color_dict['KN'] = '#e5ac39';
  color_dict['NN'] = '#7f7340';
  color_dict['MAD'] = '#7f7340';
  color_dict['MID'] = '#7f7340';
  color_dict['PAD'] = '#7f7340';
  color_dict['PC'] = '#e6daac';
  color_dict['PL'] = '#e5de73';
  color_dict['PM'] = '#b8e600';
  color_dict['PN'] = '#3a5916';
  color_dict['PP'] = '#0e3300';
  color_dict['PS'] = '#495943';
  color_dict['RG'] = '#20f200';
  color_dict['RO'] = '#009900';
  color_dict['SN'] = '#7fff91';
  color_dict['UO'] = '#008c5e';
  color_dict['VB'] = '#a3d9ce';

  return color_dict[pos];
}

function toggle_visualise_pos(pos){
  if (document.getElementById("pos_" + pos + "_slider").checked === true){
    $(".token").each(function() {
        var norm = $(this).data('xpos')
        if (norm === pos){
          color = get_pos_color(pos);
          $(this).css({'background-color': color});
        }
    });
  } else{
    $(".token").each(function() {
        var norm = $(this).data('xpos')
        if (norm === pos){
          $(this).css({'background-color': 'white'});
        }
    });
  }
}

function token_search() {
    var search_query = document.getElementById('search_token').value;

    if (document.getElementById("visualise_slider").checked === true){

      $(".norm").each(function() {
          $(this).removeClass('highlighted');
      });

      $(".norm").each(function() {
          var norm = $(this).data('norm')
          if (norm === search_query) {
            $(this).addClass('highlighted');
          }
      });

    } else {
      $(".form").each(function() {
          $(this).removeClass('highlighted');
      });

      $(".form").each(function() {
          var form = $(this).data('form')
          if (form === search_query) {
            $(this).addClass('highlighted');
          }
      });

    }
}

function apply_text_edit(type, text_id, token_id, new_value){
  queryStr = '?type=' + type + '&text_id=' + text_id + '&token_id=' + token_id + '&new_value=' + new_value
  $.get(url_prefix + '/edit_token' + queryStr, function(data) {

  }).fail(function() {
  alert('Javascript error');


  }).done(function() {
    visualise_text(text_id);

  });
}

function visualise_text(text_id){
  queryStr = '?text_id=' + text_id
  $.get(url_prefix + '/visualise' + queryStr, function(data) {


    var source = $('#visualise_template').html();
    var template = Handlebars.compile(source);
    var rendered = template(data);
    $('#visualise_zone').html(rendered);
    toggle_visualise();
    openTab('page_visualise');


  }).fail(function() {
    alert('Javascript error');

  });
}

function edit_text(type, text_id){
  var token_id = document.getElementById("edit_token_id").innerHTML;
  if (token_id === ""){
    return;
  }

  var current = document.getElementById("marked_" + type).innerHTML;

  var n = new Noty({
    type: 'alert',
    layout: 'center',
    theme: 'bootstrap-v4',
    text: '<h3>Ändra ' + type + '</h3>\
    <div class="ui form">\
    <input id="token_edit_field" type="text" value=' + current + '></div>',
    buttons: [
    Noty.button('Spara', 'btn btn-success', function () {
        var new_value = document.getElementById('token_edit_field').value;
        if (new_value.length === 0){
            n.close()
        } else {
          apply_text_edit(type, text_id, token_id, new_value);
          n.close();

        }
    }, {id: 'button1', 'data-status': 'ok', class: 'ui fluid centered_button basic button'}),
    ],
    progressBar: false,
    closeWith: ['button', 'btn btn-success'],
    animation: {
      open: 'noty_effects_open',
      close: 'noty_effects_close'
    },
    id: false,
    force: false,
    killer: false,
    queue: 'global',
    container: false,
    modal: true
  }).show()
}

function highlight_token(token){
  $(".token").each(function() {
      $(this).css({'font-weight': ''});
  });
  document.getElementById("edit_token_id").innerHTML = token.getAttribute("data-id");

  $(token).css({'font-weight': 'bold'});
  document.getElementById("marked_form").innerHTML = token.getAttribute("data-form");
  document.getElementById("marked_norm").innerHTML = token.getAttribute("data-norm");
  document.getElementById("marked_lemma").innerHTML = token.getAttribute("data-lemma");
  document.getElementById("marked_upos").innerHTML = token.getAttribute("data-upos");
  document.getElementById("marked_xpos").innerHTML = token.getAttribute("data-xpos");
  document.getElementById("marked_feats").innerHTML = token.getAttribute("data-feats");
  document.getElementById("marked_ufeats").innerHTML = token.getAttribute("data-ufeats");
  document.getElementById("marked_head").innerHTML = token.getAttribute("data-head");
  document.getElementById("marked_deprel").innerHTML = token.getAttribute("data-deprel");
  document.getElementById("marked_deps").innerHTML = token.getAttribute("data-deps");
  document.getElementById("marked_misc").innerHTML = token.getAttribute("data-misc");
}

function toggle_visualise(){
  if (document.getElementById("visualise_slider").checked === true){

    $(".norm").each(function() {
        $(this).removeClass("token_hidden");
    });

    $(".form").each(function() {
        $(this).addClass("token_hidden");
    });

  } else {
    $(".norm").each(function() {
        $(this).addClass("token_hidden");
    });

    $(".form").each(function() {
        $(this).removeClass("token_hidden");
    });
  }
  token_search();
}

document.getElementById('file_to_annotate').onchange = function () {
  f = this.value.replace(/.*[\/\\]/, '');
  if (f){
    document.getElementById("choose_file_label").innerHTML = f;
    $('#annotate_submit_label').removeClass('disabled');
    $('#annotate_submit_label').addClass('basic');
  } else {
    document.getElementById("choose_file_label").innerHTML = 'Välj fil';
    $('#annotate_submit_label').addClass('disabled');
    $('#annotate_submit_label').removeClass('basic');
  }
};

document.getElementById('file_to_analyze').onchange = function () {
  f = this.value.replace(/.*[\/\\]/, '');
  if (f){
    document.getElementById("choose_file_label_analyze").innerHTML = f;
    $('#analyze_submit_label').removeClass('disabled');
    $('#analyze_submit_label').addClass('basic');
  } else {
    document.getElementById("choose_file_label_analyze").innerHTML = 'Välj fil';
    $('#analyze_submit_label').addClass('disabled');
    $('#analyze_submit_label').removeClass('basic');
  }
};

function show_error_msg(message){
  new Noty({
    type: 'alert',
    layout: 'center',
    theme: 'bootstrap-v4',
    text: '<h3>Ett fel har uppstått</h3>' + message,
    progressBar: false,
    closeWith: ['button'],
    animation: {
      open: 'noty_effects_open',
      close: 'noty_effects_close'
    },
    id: false,
    force: false,
    killer: false,
    queue: 'global',
    container: false,
    modal: true
  }).show()
}

function filename_popup(file_id, old_filename){
  var n = new Noty({
    type: 'alert',
    layout: 'center',
    theme: 'bootstrap-v4',
    text: '<h3>Byt namn</h3>\
    <div class="ui form">\
    <input id="new_filename_text" type="text" value=' + old_filename + '></div>',
    buttons: [
    Noty.button('Spara', 'btn btn-success', function () {
        var new_name = document.getElementById('new_filename_text').value;
        if (new_name.length === 0){
            n.close()
        } else {
          set_filename(file_id, new_name);
          n.close();
        }
    }, {id: 'button1', 'data-status': 'ok', class: 'ui fluid centered_button basic button'}),
    ],
    progressBar: false,
    closeWith: ['button', 'btn btn-success'],
    animation: {
      open: 'noty_effects_open',
      close: 'noty_effects_close'
    },
    id: false,
    force: false,
    killer: false,
    queue: 'global',
    container: false,
    modal: true
  }).show()
}

function set_filename(file_id, new_filename){

  queryStr = '?new_filename=' + new_filename + '&file_id=' + file_id
  $.get(url_prefix + '/set_filename' + queryStr, function(data) {


    var source = $('#loaded_texts_template').html();
    var template = Handlebars.compile(source);
    var rendered = template(data);
    $('#loaded_texts_zone').html(rendered);
    update_sidebar();
    // initialize_semantic();

  }).fail(function() {
    alert('Javascript error');

  });
}

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

function initialize_semantic(){
    $('.ui.accordion').accordion();
    $('.activating.element').popup();
    $('.popuper').popup({hoverable:true});
    $('.tabular.menu .item').tab();
    $('.ui.dropdown').dropdown();
    $('.ui.nodropdown').dropdown({
      action: 'nothing'
    });

}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function fade_down_main(item){
  $('#' + item).transition('fade down');
}

function fade_down(item){
  $('#' + item).transition('fade down');
  var arrow = document.querySelector('#arrow_' + item)
  arrow.classList.toggle('vertically');
  arrow.classList.toggle('flipped');
}

function show_upload_section(){
  $('#upload_annotate_main').css('display', 'none');
  $('#paste_section').css('display', 'none');
  $('#file_select_label').css('display', '');
  $('#upload_annotate_section').css('display', 'block');
  document.getElementById("use_paste").checked = false;
}

function show_paste_section(){
  $('#upload_annotate_section').css('display', 'block');
  $('#upload_annotate_main').css('display', 'none');
  $('#paste_section').css('display', '');
  $('#file_select_label').css('display', 'none');
  document.getElementById("use_paste").checked = true;
}

function annotate_back(){
  $('#upload_annotate_section').css('display', 'none');
  $('#upload_annotate_main').css('display', 'block');
  document.getElementById("file_to_annotate").value = "";
  document.getElementById("pasted_text").value = "";
  document.getElementById("choose_file_label").innerHTML = 'Välj fil';
  $('#annotate_submit_label').addClass('disabled');
  $('#annotate_submit_label').removeClass('basic');
}

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(tables, filename) {
	var csv = [];
  console.log(tables);
  for (i=0; i < tables.length; i++){

    var oTable = document.getElementById(tables[i]);

    for (j = 0; j < oTable.rows.length; j++) {
  		var oCells = oTable.rows.item(j).cells;
      var row = [];
      for (k = 0; k < oCells.length; k++){
          row.push(oCells[k].innerText);
			}
      csv.push(row.join("\t").trim());
    }
  }
  download_csv(csv.join("\n").replace(/\s\s+/g, '\t').replace(/\t#/g, '\n\n#').replace(/Antal/g, '\tAntal'), filename);
}


document.querySelector("#exportbtn").addEventListener("click", function () {
  var tables = [];

  if (document.getElementById('chk_general_stats').checked) {
    tables.push('table_general');
    tables.push('table_lengths');
  }
  if (document.getElementById('chk_pos_stats').checked) {
    tables.push('table_pos');
  }
  if (document.getElementById('chk_freq_stats').checked) {
    tables.push('table_freq');
  }
  if (document.getElementById('chk_readability_stats').checked) {
    tables.push('table_readability');
  }
  if (tables.length > 0){
    export_table_to_csv(tables, "table.csv");
  }

});


$( document ).ready(function() {
  window.url_prefix = document.getElementById("urls").value;
  openTab('page_upload_text');
  console.log('documet ready');
  update_sidebar();
  initialize_semantic();
});
