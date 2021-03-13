//import logo from './logo.svg';
import './App.css';
//import { ReactComponent } from '*.svg';
import React from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';

const testData = [
  { id: 0, name: "Dan Abramov", avatar_url: "https://avatars0.githubusercontent.com/u/810438?v=4", company: "@facebook" },
  { id: 1, name: "Sophie Alpert", avatar_url: "https://avatars2.githubusercontent.com/u/6820?v=4", company: "Humu" },
  { id: 2, name: "Sebastian Markbåge", avatar_url: "https://avatars2.githubusercontent.com/u/63648?v=4", company: "Facebook" },
];

class Card extends React.Component {
  render() {
    //"this" refear to an instance of card component
    const profile = this.props;
    return (
      <div className="github-profile">
        <img src={profile.avatar_url} alt="user avatar" />
        <div className="name">{profile.name}</div>
        <div className="company">{profile.company}</div>
      </div>
    );
  }
}

const CardList = (props) => (
  <div>
    {/* if we ommit key={profile.id} we are goint to get a warning message  */}
    {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
  </div>
);

/*we can define onClick event on button but the author prefere to use onSubmit ont the form, view note1. By using onSubmit, we can
utilize native form submission features. For Example, you can make this input required, and the onSubmit event will honor that
in modern browsers*/
/**Every React event function receives an event argument, and for React events this argument is just a wrapper around the native JS event 
 * object. All the methods available in the native event object are also available here. For example, since we want to take over the HTML submit
 * logic we should prevent the default form submission behavior here using event.preventDefault(); (see note 2)
 * To read the value that user tyes in this inbox we can simply use de DOM API. We can give the input here an ID attribute and use
 * getElementById to read its value. React has a special property named ref that we can use to get a reference to this element ( ref={} ) 
 * this is kind of fancy ID that React keeps in-memory and associates with every rendered element. 
 * To use ref we need to instanciate an object (*** note 4) we can name it anything we like, we named here userNameInput, and we do a
 * React.createRef call in there, and to use this ref, that is part of this instance now we can use ref={this.userNameInput}
 *  Inside the handleSubmit the value is this.userNameInput.current.value
*/

class Form extends React.Component {
  
  //note 4
  userNameInput = React.createRef();
  handleSubmit = async (event) => {
    //note 2
    /**This is important when working with forms, because without prevent default, if you submit the form, the page is going
     * to refresh.
     */
    event.preventDefault();
    //fetching the data
    const resp = await axios.get(`https://api.github.com/users/${this.userNameInput.current.value}`);
    this.props.onSubmit(resp.data);
    //note 5
    console.log(this.userNameInput.current.value);
    this.userNameInput.current.value = '';
  };

  render() {
    return (
      //note 1
      <form onSubmit={this.handleSubmit}>
        <input type="text"
          placeholder="Github username"
          ref={this.userNameInput}
          required
        />
        <button>Add Card</button>
      </form>
    );
  };
}

/** React has another method to work with input element which is to control their values directly and it has through React itself, Rather than
 * reading it from the DOM elements, this method is often labeled as controlled components, and it has some more advantages over the simple ref
 * property. We introduce state object,and in this object we define an element the input value of the userName filed ( **6) and we initialize it as 
 * an empty string, then we use this new state element as the value of the input element. ( value = {this.state.userName}) and his immediately
 * creates a controlled element. Now we are controlling the value of the input. 
 * However you cant really type in this input field anymore because React is now controlling the value, this is way we need onChange event so that
 * the DOM can tell  React that something has changed in this input and you shoul reflected in the UI as well.
 * Basically, on Change event happened on every character that we typed here,and it made React aware of this element state change and
 * and React reflected the change back to the element itself because it's a regular React state change. This method is valuable if you need to provide some kind of
 * feedback for the user as the user typing. One example of that woul be a password strength indicator or the count of character as the user
 * is typing as an Twitter Tweet's form, because the whole state is in React, we can add a UI description as well. And we don't need to read the value from the DOM,
 * it's in React's memory.
 * 
*/
class Form2 extends React.Component {
  //**6 */
  state = { userName: '' }
  handleSubmit = async (event) => {
    event.preventDefault();
    //fetching the data
    const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
    this.props.onSubmit (resp.data);
    this.setState ( {userName : ''});   
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} id="form2">
        <input type="text"
          value={this.state.userName}
          onChange={event => this.setState({ userName: event.target.value })}
          placeholder="Github username"
          required
        />
        <button>Add Card</button>
      </form>
    );
  };
}



class App extends React.Component {
  //---------------------------------------------
  //constructor (props){
  //  super(props);
  //  this.state = {
  //    profiles : testData,
  //  };
  //}
  //the following lines are prefered at the above
  state = {
    profiles: testData,
  };

  addNewProfile = (profileData) => {
    console.log('App', profileData);
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }));
  };

  render() {
    return (
      <div>
        <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <Form2 onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
      </div>
    );
  }
}

export default App
