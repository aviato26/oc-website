

import '../css/style.css';

class PageDesciption{
    constructor(){
        // adding container for page desription text
        this.servicesContainer = document.createElement('section');

        this.shadow1ContainerBoundary = false;
        this.shadow2ContainerBoundary = false;

        this.stateClock = 0.0;
        this.stateClock2 = 0.0;
        
        this.animationStart = false;
        this.start = 0;
        this.end = 1;

        // uncomment to add mark up to page
        document.body.appendChild(this.servicesContainer);
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
        
        div = document.createElement('div');
        ul = document.createElement('ul');
        div.className = className;
        allText = text.map(t => {
            li = document.createElement('li');
            textNode = document.createTextNode(t);
            li.appendChild(textNode);            
            ul.appendChild(li);            
        })

        div.appendChild(ul);

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
        //const servicesDescription = this.addTextElement("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", 'page-description');
        const servicesDescription = this.addServicesElement(['IT Consulting', 'Repair and Installation', 'Data visualization and analysis', 'Database Design'], 'page-description');
        return servicesDescription;
    }

    addAboutScreenText(){
        //this.removeAllNodes();
        //const aboutPage = this.addSeperatedElement('About-Us', 'about-us-section page-section');
        const aboutPage = this.addTextElement('About Us', 'page-section');        
        return aboutPage;
    }

    addAboutScreenDescription(){
        //this.removeAllNodes();
        //const aboutPage = this.addSeperatedElement('About-Us', 'about-us-section page-section');
        //const aboutScreenDescription = this.addTextElement("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", 'page-description');
        const aboutScreenDescription = this.addTextElement("We are an IT company located in sunny los angeles california powered by coffee and tech.", 'page-description');        
        return aboutScreenDescription;
    }

    addContactScreenText(){
        //this.removeAllNodes();
        //const contactPage = this.addSeperatedElement('Contact Us');
        const contactPage = this.addTextElement('Contact Us', 'page-section');       
        return contactPage;
    }

    addContactDescription(){
        const contactScreenDescription = this.addTextElement("Address", 'page-description');                
        return contactScreenDescription;
    }

    addContactMailTo(){
        const contactMailTo = this.addHyperLink("Email Address", 'page-description');     
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