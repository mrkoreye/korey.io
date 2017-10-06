(function() {
  var projectElements = document.getElementsByClassName('project');
  [].forEach.call(projectElements, function(element) {
    element.addEventListener('click', function(event) {
      element.classList.toggle('active');
    });
  });

  var emailElement = document.getElementById('email-div');
  var emailAddress = [
    'mrkoreye',
    '@',
    'gmail',
    '.',
    'com'
  ].join('');
  emailElement.innerText = emailAddress;
})();