import React, { Component, ChangeEvent } from 'react';
import { Location, Marker, COLORS } from './marker';
import { Building, BUILDINGS } from './buildings';

// TODO: add imports as needed

type EditorProps = {
  /** The marker that the user wants to edit. */
  marker: Marker;

  /** If provided, let the user move to this location. */
  moveTo?: Location; // Note: not needed until task 3

  /** Callback to invoke when the user wants to cancel editing. */
  onCancelClick: () => void;

  /** Calback to invoke when the user wants to save the edit. */
  onSaveClick: (name: string, color: string, loc: Location) => void;
};

type EditorState = {
  name: string;
  color: string;
  selectedBuilding: string;
  filterText: string;
  moveToNewLoc: boolean;
  // TODO: add more later
};


/** Component that allows the user to edit a marker. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      name: props.marker.name, 
      color: props.marker.color, 
      selectedBuilding: '',
      filterText: '',
      moveToNewLoc: false
    };
  }

  componentDidUpdate = (oldProps: EditorProps, _oldState: EditorState): void => {
    // If the App changed our props (so we are now editing a new Marker), then
    // we should update our state to show its name and color instead.
    if (oldProps !== this.props) {
      this.setState({name: this.props.marker.name, color: this.props.marker.color});
    }
  };

  render = (): JSX.Element => {
    
    return <div>
        <div>
          Name: 
          <input type="text" value={this.state.name}
              onChange={this.doNameChange} />
          {this.renderBuildingSelecter()}
        </div>
        <div>
          Color: 
          <select
            value={this.state.color}
            onChange={this.doColorChange}
          >
          {this.renderColor()}
          </select>
          {this.renderBuildingFilter()}
        </div>
        {this.renderCheck()}
        <button onClick={this.doSaveClick}>Save</button>
        <button onClick={this.doCancelClick}>Cancel</button>
      </div>;
  };

  // Render options for different colors
  renderColor = (): JSX.Element[] => {
    const result: JSX.Element[] = [];
    for (let color of COLORS){
      result.push(<option>{color}</option>);
    }
    return result;
  }
  
  // Decide if a building filter is needed 
  renderBuildingFilter = (): JSX.Element => {
    if(!this.props.moveTo)
      return (<div>Filter:
        <input 
          type="text"
          value={this.state.filterText}
          onChange={this.doFilterChange} />
        (show only buildings including this text)
        </div>
      )
    return(<div></div>)
  }

  // Decide if a checkbox for saving location is needed
  renderCheck = (): JSX.Element => {
    if(this.props.moveTo)
      return (<div>
        <input type="checkbox" onChange={this.doCheckChange}></input>
        move to new location (grey)
      </div>
      );
    return (<div></div>);
  }

  // Render building selector
  renderBuildingSelecter = (): JSX.Element => {
    if(!this.props.moveTo)
      return (<div>Move To:
              <select
                value={this.state.selectedBuilding}
                onChange={this.doBuildingChange}
              >
              {this.renderLocation()}
              </select>
            </div>)
    return (<p></p>);
  }


  // Render options for building selector
  renderLocation = (): JSX.Element[] => {
    const result: JSX.Element[] = [];
    result.push(<option>CurrentLocation</option>);
    let filteredBuildings: Building[] = BUILDINGS.filter((building) =>
      building.longName.toLowerCase().includes(this.state.filterText.toLowerCase())
    );
    if(this.state.filterText){
      filteredBuildings = filteredBuildings.sort((a, b) => a.longName.localeCompare(b.longName));
    }
    for(let building of filteredBuildings){
      result.push(<option>{building.longName}</option>);
    }
    return result;
  }

  // Decide the location to save to
  getNewLoc = (): Location => {
    if(this.state.moveToNewLoc && this.props.moveTo){
      this.setState((prevState) => ({
        moveToNewLoc: !prevState.moveToNewLoc
      }));
      return this.props.moveTo;
    }
    let buildingName: string = this.state.selectedBuilding.toLowerCase();
      for(let currBuilding of BUILDINGS){
        let currName: string = currBuilding.longName.toLowerCase();
        if(currName === buildingName)
          return currBuilding.location;        
      }
      return this.props.marker.location;
  }

  doCheckChange = (): void => {
    this.setState((prevState) => ({
      moveToNewLoc: !prevState.moveToNewLoc
    }));
  }

  doNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: event.target.value});
  };

  doColorChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ color: event.target.value });
  };

  doSaveClick = (): void => {
    let savedLoc: Location = this.getNewLoc();
    this.props.onSaveClick(this.state.name, this.state.color, savedLoc); 
  };

  doCancelClick = (): void => {
    this.props.onCancelClick();
  };

  doBuildingChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({selectedBuilding: event.target.value});
    
  }

  doFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({filterText: event.target.value});
  }
}