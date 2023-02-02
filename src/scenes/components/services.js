

import '../css/style.css';

class PageDesciption{
    constructor(){
        // adding container for page desription text
        this.servicesContainer = document.createElement('section');

        //this.servicesContainer.style.height = `${window.innerHeight}px`;
        //this.servicesContainer.style.height = `100vh`;        

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
/*
        const header = this.addSeperatedElement('h1', 'service-page-title', 'Services');


        const secondParagraphHeader = this.addSeperatedElement('h2', 'service-page-second-title', 'Maintenance and Repair');
        const secondParagraph = this.addSeperatedElement('p', 'services-page-description', 'If it aint broken... We truly believe in getting the most out of your devices. We upgrade, we fix, we save you money.');

        secondParagraphHeader.appendChild(secondParagraph);

        const thirdParagraphHeader = this.addSeperatedElement('h2', 'service-page-second-title', 'Consulting and Networking');
        const thirdParagraph = this.addSeperatedElement('p', 'services-page-description', 'Would like to know how to best tackle a project, feel overwhelmed? We are just a email or phone call away.');

        thirdParagraphHeader.appendChild(thirdParagraph);

        const shadowParagraphHeader = this.addSeperatedElement('h2', 'service-page-second-title shadow', '');

        const shadow2ParagraphHeader = this.addSeperatedElement('h2', 'service-page-second-title shadow2', '');
*/
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



    addSeperatedElement(text, className = 'page-section'){

        let div;
        let textNode;
        let elementArray = [];

        const charArray = text.split(" ");
        
        charArray.map(c => {
            div = document.createElement('div');
            div.className = className;
            textNode = document.createTextNode(`${c}`);
            div.appendChild(textNode);

            this.servicesContainer.appendChild(div);

            elementArray.push(div);

            //this.textSegments.servicesContainer.appendChild(div);
        })

        return elementArray;
    }

    addTextElement(text, className){
        let div;
        let textNode;
        
        div = document.createElement('div');
        div.className = className;
        textNode = document.createTextNode(text);
        div.appendChild(textNode);

        this.servicesContainer.appendChild(div);

        return div;
    }

    // method for creating and appending home page text
    addHomeScreenText(){

        //this.removeAllNodes();        
        const homePage = this.addSeperatedElement('Professional Technology Assistance');        
        return homePage;
    }

    addServicesScreenText(){
        //this.removeAllNodes();
        const servicesPage = this.addSeperatedElement('Services');
        return servicesPage;
    }

    addServicesDescription(){
        const servicesDescription = this.addTextElement("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", 'page-description');
        return servicesDescription;
    }

    addAboutScreenText(){
        //this.removeAllNodes();
        const aboutPage = this.addSeperatedElement('About Us');
        return aboutPage;
    }

    addContactScreenText(){
        //this.removeAllNodes();
        const contactPage = this.addSeperatedElement('Contact Us');
        return contactPage;
    }
    
    removeAllNodes(){
        this.servicesContainer.querySelectorAll('*').forEach(node => node.remove());
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