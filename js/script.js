'use strict';

(() => {
  const url = 'http://api.openweathermap.org/data/2.5/weather?q=';
  const apiKey = 'eac9eebd5253a65b267d683dfc52b619'; // Replace "APIKEY" with your own API key; otherwise, your HTTP request will not work
  const activities = {
    teamIn: ['basketball', 'hockey', 'volleyball'],
    teamOutWarm: ['softball/baseball', 'football/soccer', 'American football', 'rowing', 'tennis', 'volleyball', 'ultimate frisbee', 'rugby'],
    teamOutCold: ['hockey'],
    soloIn: ['rock climbing', 'swimming', 'ice skating'],
    soloOutWarm: ['rowing', 'running', 'hiking', 'cycling', 'rock climbing'],
    soloOutCold: ['snowshoeing', 'downhill skiing', 'cross-country skiing', 'ice skating']
  };
  let state = {};
  let category = 'all';

  const updateActivityList = event => {
//		if (event !== undefined && $(this).hasClass('selected')) {
//     if (event !== undefined && event.target.classList.contains('selected')) {
    if (event) {
      if (event.target.classList.contains('selected')) {
        // if the 'event' parameter is defined, then a tab has been clicked; if not, then this is the
        //   default case and the view simply needs to be updated
        // if the clicked tab has the class 'selected', then no need to change location of 'selected' class
        //   or change the DOM
        return true;
//		} else if (event !== undefined && !$(this).hasClass('selected')) {
//       } else if (event !== undefined && !event.target.classList.contains('selected')) {
      } else {
        // if the 'event' parameter is defined, then a tab has been clicked
        // if the clicked tab does not have the class 'selected', then location of 'selected' class must be added
        //   to the clicked element and removed from its siblings
//			category = $(this).attr('id');
        category = event.target.id;

//			$('.options div').removeClass('selected');

        document.querySelectorAll('.options div').forEach(el => {
          el.classList.remove('selected');
        });

//			$(this).addClass('selected');
        event.target.classList.add('selected');
      }
    }
    const updateState = type => {
      switch (category) {
        case 'solo':
          state.activities.push(...activities[`solo${type}`]);
          break;
        case 'team':
          state.activities.push(...activities[`team${type}`]);
          break;
        default:
          state.activities.push(...activities[`solo${type}`]);
          state.activities.push(...activities[`team${type}`]);
          break;
      }
    };

    state.activities = [];
    if (state.condition === 'Rain') {
      updateState('In');
    } else if (state.condition === 'Snow' || state.degFInt < 50) {
      updateState('OutCold');
    } else {
      updateState('OutWarm');
    }

//		const $into = $('.activities')[0];
    const into = document.querySelector('.activities');

//		ReactDOM.render(<Activities {...state} />, $into);
//     ReactDOM.render(<Activities {...state} />, into);

    // function Activities(props) {
    //   const activitiesList = props.activities.map(function (activity, index) {
    //     return <li key={index}>{activity}</li>;
    //   });
    //   return (
    //     <div>
    //       <ul>{activitiesList}</ul>
    //     </div>
    //   );
    // }

    let activitiesContainer = document.createElement('div');
    let list = document.createElement('ul');
    state.activities.forEach((activity, index) => {
      let listItem = document.createElement('li');
      list.setAttribute('key', index);
      listItem.textContent = activity;
      list.appendChild(listItem);
    });
    activitiesContainer.appendChild(list);
    document.querySelector('.activities div') ?
      into.replaceChild(activitiesContainer, document.querySelector('.activities div')) :
      into.appendChild(activitiesContainer);

    $('.results').slideDown(300);
  };

  // handle ajax success
  const updateUISuccess = response => {
    const degC = response.main.temp - 273.15;
    const degCInt = Math.floor(degC);
    const degF = degC * 1.8 + 32;
    const degFInt = Math.floor(degF);
    state = {
      condition: response.weather[0].main,
      icon: `http://openweathermap.org/img/w/${response.weather[0].icon}.png`,
      degCInt: Math.floor(degCInt),
      degFInt: Math.floor(degFInt),
      city: response.name
    };

//     const Forecast = props => (
//       <div>
//         <p className="city">{props.city}</p>
//         <p>{props.degCInt}&#176; C / {props.degFInt}&#176; F <img src={props.icon} alt={props.condition}/></p>
//       </div>
//     );
//

//		const $into = $('.conditions')[0];
    const into = document.querySelector('.conditions');

// //		ReactDOM.render(<Forecast {...state} />, $into);
//     ReactDOM.render(<Forecast {...state} />, into);

    let container = document.createElement('div');
    let cityPara = document.createElement('p');
    cityPara.setAttribute('class', 'city');
    cityPara.textContent = state.city;
    let conditionsPara = document.createElement('p');
    conditionsPara.textContent = `${state.degCInt}\u00B0 C / ${state.degFInt}\u00B0 F`;
    let iconImage = document.createElement('img');
    iconImage.setAttribute('src', state.icon);
    iconImage.setAttribute('alt', state.condition);
    conditionsPara.appendChild(iconImage);
    container.appendChild(cityPara);
    container.appendChild(conditionsPara);
    document.querySelector('.conditions div') ?
      into.replaceChild(container, document.querySelector('.conditions div')) :
      into.appendChild(container);

    updateActivityList();
  };

  // handle ajax failure
  const updateUIFailure = () => {
    // $('.conditions').text('Weather information unavailable');
    document.querySelector('.conditions').textContent = 'Weather information unavailable';
  };

  // get weather data when user clicks Forecast button, then add temp & conditions to view
//	$('.forecast-button').click(function(e) {
  document.querySelector('.forecast-button').addEventListener('click', e => {
    e.preventDefault();
//		const location = $('#location').val();
    const location = document.querySelector('#location').value;
//		$('#location').val('');
    document.querySelector('#location').value = '';
    /*
        $.get(url + location + '&appid=' + apiKey).done(function(response) {
          updateUISuccess(response);
        }).fail(function() {
          updateUIFailure();
        });
    */

    fetch(`${url + location}&appid=${apiKey}`)
      .then(response => response.json())
      .then(response => updateUISuccess(response))
      .catch(() => updateUIFailure());
  }, false);

  // update list of sports when user selects a different category (solo/team/all)
  //$('.options div').on('click', updateActivityList);
  document.querySelectorAll('.options div').forEach(el => {
    el.addEventListener('click', updateActivityList, false);
  });

  // handle selection of a new category (team/solo/all)
})();
