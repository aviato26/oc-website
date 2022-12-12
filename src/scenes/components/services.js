
import ft from './font.ttf'
//import rb from './ruby.ttf';
//const rb = require('./ruby.ttf');
import '../css/style.css';

class PageDesciption{
    constructor(){
        // adding container for page desription text
        this.servicesContainer = document.createElement('section');

        this.servicesContainer.style.height = `${window.innerHeight}px`;

        this.shadow1ContainerBoundary = false;
        this.shadow2ContainerBoundary = false;

        this.stateClock = 0.0;
        this.stateClock2 = 0.0;
        
        this.animationStart = false;
        this.start = 0;
        this.end = 1;

        // uncomment to add mark up to page
        document.body.appendChild(this.servicesContainer);

        //document.body.style.height = window.innerHeight * 12.5;

        // need to dynamically set body elements height to check scrolling parameter for animation
        //const bodyElement = document.querySelector('body');
        //bodyElement.style.height = `${window.innerHeight * 4}px`;

        const header = this.addElement('h1', 'service-page-title', 'Services');


        const secondParagraphHeader = this.addElement('h2', 'service-page-second-title', 'Maintenance and Repair');
        const secondParagraph = this.addElement('p', 'services-page-description', 'If it aint broken... We truly believe in getting the most out of your devices. We upgrade, we fix, we save you money.');

        secondParagraphHeader.appendChild(secondParagraph);

        const thirdParagraphHeader = this.addElement('h2', 'service-page-second-title', 'Consulting and Networking');
        const thirdParagraph = this.addElement('p', 'services-page-description', 'Would like to know how to best tackle a project, feel overwhelmed? We are just a email or phone call away.');

        thirdParagraphHeader.appendChild(thirdParagraph);

        const shadowParagraphHeader = this.addElement('h2', 'service-page-second-title shadow', '');

        const shadow2ParagraphHeader = this.addElement('h2', 'service-page-second-title shadow2', '');

        //console.log(this.lerpingAnimation(this.stateClock))
        /*
        this.servicesContainer.appendChild(header);

        this.servicesContainer.appendChild(secondParagraphHeader);

        this.servicesContainer.appendChild(thirdParagraphHeader);

        this.servicesContainer.appendChild(shadowParagraphHeader);

        this.servicesContainer.appendChild(shadow2ParagraphHeader);
        */

/*
        this.containers = [secondParagraphHeader, thirdParagraphHeader, shadowParagraphHeader, shadow2ParagraphHeader];

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                this.shadow1ContainerBoundary = (entry.isIntersecting && (entry.target.className.search(/\bshadow\b/) > 1)) ? true : false;
                this.shadow2ContainerBoundary = (entry.isIntersecting && (entry.target.className.search(/\bshadow2\b/) > 1)) ? true : false;            

                entry.target.classList.toggle('active', entry.isIntersecting)
            });
        }, {
            threshold: 0.5
        });

        this.containers.forEach(object => observer.observe(object));
*/
    }


    timingAnimation(animation, state) {
        if(animation){
            if(state < 1){
                state += 0.01;
            }
        }

        if(!animation){
            if(state > 0.0){
                state -= 0.01;
            }
        }

        return state;

    }



    addElement(element, id, text){
        const ele = document.createElement(element);
        ele.setAttribute('class', id);
        ele.textContent = text;

        return ele;
    }

    // method for creating and appending home page text
    addHomeScreenText(){

        //const homePage = this.addElement('h2', 'service-page-second-title', 'Professional Technology Assistance');
        const homePage = this.addElement('h2', 'page-section', 'Professional Technology Assistance');
        this.servicesContainer.appendChild(homePage);
    }

    addServicesScreenText(){
        const servicesPage = this.addElement('h2', 'page-section', 'All about the services');
        this.servicesContainer.appendChild(servicesPage);
    }

    addAboutScreenText(){
        const aboutPage = this.addElement('h2', 'page-section', 'stuff about us');
        this.servicesContainer.appendChild(aboutPage);        
    }

    addContactScreenText(){
        const contactPage = this.addElement('h2', 'page-section', 'stuff about contacting us');
        this.servicesContainer.appendChild(contactPage);                
    }

    unMountText(){
        // css style needs to be named page desciption to be able to find and remove element from parent container
        const childElement = document.querySelector('.page-section');

        // checking to see if there are any child nodes appended
        if(this.servicesContainer.childNodes.length){
            this.servicesContainer.removeChild(childElement);
        }
    }

}

export default PageDesciption;