'use strict';

(() => {
  const url = 'http://api.openweathermap.org/data/2.5/weather?q=';
  const apiKey = 'eac9eebd5253a65b267d683dfc52b619';
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
    // if the 'event' parameter is defined, then a tab has been clicked; if not, then this is the
    //   default case and the view simply needs to be updated
    if (event) {
      // if the clicked tab has the class 'selected', then no need to change location of 'selected' class
      //   or change the DOM
      if (event.target.classList.contains('selected')) {
        return true;
      } else {
        // if the clicked tab does not have the class 'selected', then location of 'selected' class must be added
        //   to the clicked element and removed from its siblings
        category = event.target.id;

        document.querySelectorAll('.options div').forEach(el => {
          el.classList.remove('selected');
        });

        event.target.classList.add('selected');
      }
    }

    // handle selection of a new category (team/solo/all)
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

    const into = document.querySelector('.activities');

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

    const into = document.querySelector('.conditions');

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
    document.querySelector('.conditions').textContent = 'Weather information unavailable';
  };

  // get weather data when user clicks Forecast button, then add temp & conditions to view
  document.querySelector('.forecast-button').addEventListener('click', e => {
    e.preventDefault();
    const location = document.querySelector('#location').value;
    document.querySelector('#location').value = '';

    fetch(`${url + location}&appid=${apiKey}`)
      .then(response => response.json())
      .then(response => updateUISuccess(response))
      .catch(() => updateUIFailure());
  }, false);

  // update list of sports when user selects a different category (solo/team/all)
  document.querySelectorAll('.options div').forEach(el => {
    el.addEventListener('click', updateActivityList, false);
  });
})();
