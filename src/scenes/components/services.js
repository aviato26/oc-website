

import '../css/style.css';

class PageDesciption{
    constructor(){
        // adding container for page desription text
        this.servicesContainer = document.createElement('section');
        this.bodyContainer = document.querySelector('body');

        this.shadow1ContainerBoundary = false;
        this.shadow2ContainerBoundary = false;

        this.stateClock = 0.0;
        this.stateClock2 = 0.0;
        
        this.animationStart = false;
        this.start = 0;
        this.end = 1;

        // for mobile devices
        this.addMenu();

        this.addScrollLabel();

        // for desktop devices
        //this.addNavBar();

        this.servicesTextContainer = document.createElement('div');
        this.servicesTextContainer.className = 'services-text-container';        

        this.aboutTextContainer = document.createElement('div');
        this.aboutTextContainer.className = 'about-text-container';                

        this.contactTextContainer = document.createElement('div');
        this.contactTextContainer.className = 'contact-text-container';                        

        this.servicesContainer.append(this.servicesTextContainer);
        this.servicesContainer.append(this.aboutTextContainer);        
        this.servicesContainer.append(this.contactTextContainer);        

        // uncomment to add mark up to page
        document.body.appendChild(this.servicesContainer);

        // getting all elements that will be animated when user clicks menu button
        this.navMenuContainer = document.querySelector('.menu-text-containers');
        this.menuBars = [...document.querySelectorAll('.menu-bars')];
        this.canvas = document.querySelector('canvas');
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

    addScrollLabel(){

        const container = document.createElement('div');
        container.className = 'scroll-down';        

        const scroll = document.createElement('span');
        const scrollText = document.createTextNode('Scroll Down');        
        scroll.append(scrollText);           

        container.append(scroll);

        const arrowContainer = document.createElement('div');
        arrowContainer.className = 'arrow-container';

        const arrow = document.createElement('div');
        arrow.className = 'long-arrow-right';

        arrowContainer.append(arrow);
        
        container.append(arrowContainer);

        this.scrollLabel = container;

        this.servicesContainer.appendChild(container);

    }

    addNavBar(){
        const container = document.createElement('div');
        container.className = 'nav-bar';        

        const home = document.createElement('h3');
        const homeText = document.createTextNode('Home');        
        home.append(homeText);
        home.className = 'nav-text';

        const services = document.createElement('h3');
        const servicesText = document.createTextNode('Services');        
        services.append(servicesText);        
        services.className = 'nav-text';

        const about = document.createElement('h3');
        const aboutText = document.createTextNode('About');        
        about.append(aboutText);        
        about.className = 'nav-text';

        const contact = document.createElement('h3');
        const contactText = document.createTextNode('Contact');        
        contact.append(contactText);        
        contact.className = 'nav-text';

        container.append(home, services, about, contact);
        
        this.servicesContainer.appendChild(container);

    }

    addMenu(){        
        const container = document.createElement('div');
        container.className = 'menu';
        
        const bar1 = document.createElement('div');
        const bar2 = document.createElement('div');
        const bar3 = document.createElement('div');                
        const barContainer = document.createElement('div');

        bar1.className = 'menu-bars';
        bar2.className = 'menu-bars';
        bar3.className = 'menu-bars';                
        barContainer.className = 'menu-bars-container';

        barContainer.append(bar1, bar2, bar3);

        this.bodyContainer.append(barContainer);

        const textContainers = document.createElement('div');
        textContainers.className = 'menu-text-containers';

        const homeTextContainers = document.createElement('div');
        homeTextContainers.className = 'menu-text-item-containers';
        homeTextContainers.tabIndex = 0;        
        
        const servicesTextContainers = document.createElement('div');
        servicesTextContainers.className = 'menu-text-item-containers';
        servicesTextContainers.tabIndex = 1;
        
        const aboutTextContainers = document.createElement('div');
        aboutTextContainers.className = 'menu-text-item-containers';
        aboutTextContainers.tabIndex = 2;
        
        const contactTextContainers = document.createElement('div');
        contactTextContainers.className = 'menu-text-item-containers';
        contactTextContainers.tabIndex = 3;

        const homeText = document.createElement('h2');
        const homeTextNode = document.createTextNode(`Home`);
        homeText.appendChild(homeTextNode);
        homeTextContainers.append(homeText);
        
        const servicesText = document.createElement('h2');
        const servicesTextNode = document.createTextNode(`Services`);
        servicesText.appendChild(servicesTextNode);
        servicesTextContainers.append(servicesText);        

        const aboutText = document.createElement('h2');                
        const aboutTextNode = document.createTextNode(`About`);
        aboutText.appendChild(aboutTextNode);
        aboutTextContainers.appendChild(aboutText);

        const contactText = document.createElement('h2');
        const contactTextNode = document.createTextNode(`Contact`);
        contactText.appendChild(contactTextNode);        
        contactTextContainers.appendChild(contactText);

        const homeDescription = document.createElement('h3');
        const homeDescTextNode = document.createTextNode(`Back to the start`);
        homeDescription.appendChild(homeDescTextNode);
        homeTextContainers.append(homeDescription);        

        const servicesDescription = document.createElement('h3');
        const servicesDescTextNode = document.createTextNode(`Learn more about what we do`);
        servicesDescription.appendChild(servicesDescTextNode);
        servicesTextContainers.append(servicesDescription);

        const aboutDescription = document.createElement('h3');
        const aboutDescTextNode = document.createTextNode(`Who we are`);
        aboutDescription.appendChild(aboutDescTextNode);
        aboutTextContainers.append(aboutDescription);
        
        const contactDescription = document.createElement('h3');                        
        const contactDescTextNode = document.createTextNode(`Get in touch`);
        contactDescription.appendChild(contactDescTextNode);
        contactTextContainers.append(contactDescription);

        textContainers.append(homeTextContainers, servicesTextContainers, aboutTextContainers, contactTextContainers);

        this.bodyContainer.append(textContainers);
        
        //his.servicesContainer.appendChild(container);
        //this.bodyContainer.appendChild(container);

        this.menu = barContainer;
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

            //this.servicesContainer.appendChild(div);

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

    addHyperLink(text, className){
        let div;
        let a;
        let textNode;
        
        div = document.createElement('div');
        a = document.createElement('a');        
        a.href = "mailto:someone@example.com";

        div.className = className;
        textNode = document.createTextNode(text);
        a.appendChild(textNode);
        div.appendChild(a);

        this.servicesContainer.appendChild(div);

        return div;
    }

    addServicesElement(text, className){
        let div;
        let ul;
        let li;
        let allText;
        let textNode;
        let textContainer;
        
        div = document.createElement('div');
        //ul = document.createElement('ul');
        ul = document.createElement('div');        
        div.className = className;
        ul.className = 'services-list';
        
        allText = text.map(t => {

            textContainer = document.createElement('div');

            t.split('').map(c => {
                ///li = document.createElement('li');
                li = document.createElement('p');                
                textNode = document.createTextNode(c);
                li.appendChild(textNode);            

                textContainer.append(li);
            })


            ul.append(textContainer);            

        })

        div.appendChild(ul);

        this.servicesContainer.appendChild(div);

        return div;
    }

    // method for creating and appending home page text
    addHomeScreenText(){

        //this.removeAllNodes();        
        //const homePage = this.addSeperatedElement('Professional Technology Assistance', 'title-header');        
        const homePage = this.addTextElement(`The most comprehensive
         IT support`, 'home-title');                

        const homePageDescription = this.addTextElement(`No technical language
        just words that you understand.`, 'home-description');                        

        
        const container = document.createElement('div');
        container.append(homePage, homePageDescription);
        container.className = 'home-text-container';
        this.servicesContainer.appendChild(container);
        //container.className = 'text-container';

        //container.append(...homePage);
        //this.servicesContainer.appendChild(container);

        //return [homePage, homePageDescription];
        return [container, homePage, homePageDescription];        
        //return homePage;        
    }

    addServicesScreenText(){
        //this.removeAllNodes();
        //const servicesPage = this.addSeperatedElement('Services');
        const servicesPage = this.addTextElement('Services', 'services-title');
        //return [homePage, homePageDescription];
        this.servicesTextContainer.append(servicesPage);

        return servicesPage;
    }

    addServicesDescription(){
        //const servicesDescription = this.addTextElement("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", 'page-description');
        //const servicesDescription = this.addServicesElement(['IT Consulting', 'Repair and Installation', 'Data visualization and analysis', 'Database Design'], 'page-description');
        const servicesDescription = this.addServicesElement(['IT Consulting', 'Repair - Install', 'Web Development', 'Database Design'], 'services-container');        
        //const servicesDescription = this.addSeperatedElement(`IT Consulting, Repair - Install Web Development Database Design`, 'services-container');        
        this.servicesTextContainer.append(servicesDescription);        
        return servicesDescription;
    }

    addAboutScreenText(){
        //this.removeAllNodes();
        //const aboutPage = this.addSeperatedElement('About-Us', 'about-us-section page-section');
        const aboutPage = this.addTextElement('About Us', 'about-title');        
        this.aboutTextContainer.append(aboutPage);
        return aboutPage;
    }

    addAboutScreenDescription(){
        //this.removeAllNodes();
        //const aboutPage = this.addSeperatedElement('About-Us', 'about-us-section page-section');
        //const aboutScreenDescription = this.addTextElement("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", 'page-description');
        const aboutScreenDescription = this.addTextElement("We are an IT company located in sunny los angeles california powered by coffee and tech.", 'page-description');        
        this.aboutTextContainer.append(aboutScreenDescription);        
        return aboutScreenDescription;
    }

    addContactScreenText(){
        //this.removeAllNodes();
        //const contactPage = this.addSeperatedElement('Contact Us');
        const contactPage = this.addTextElement('Contact Us', 'contact-title');       

        this.contactTextContainer.append(contactPage);
        return contactPage;
    }

    addContactDescription(){
        const contactScreenDescription = this.addTextElement("Address", 'contact-description');                
        this.contactTextContainer.append(contactScreenDescription);
        
        return contactScreenDescription;
    }

    addContactMailTo(){
        const contactMailTo = this.addHyperLink("Email Address", 'contact-description');     
        this.contactTextContainer.append(contactMailTo);

        return contactMailTo;           
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