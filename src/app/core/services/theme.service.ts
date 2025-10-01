import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
    // this.loadTheme();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark-mode');
    }
    if (savedTheme == 'light') {
      this.lightMode()
    } else if (savedTheme == 'dark') {
      this.darkMode()
    }
  }

  darkMode() {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.documentElement.classList.remove('light-mode');

    console.log("inside dark");
    const divs = document.querySelectorAll('div');

    divs.forEach(div => {
      div.classList.add('dark-mode');
      div.classList.remove('light-mode');
    });


    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }



  lightMode() {
    document.body.classList.add('light-mode');
    document.documentElement.classList.add('light-mode');

    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');

    const divs = document.querySelectorAll('div');
    divs.forEach(div => {
      div.classList.add('light-mode');
      div.classList.remove('dark-mode');
    });





    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }
}
