import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    projectsList: [],
    activeOptionId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  formattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    name: data.name,
  })

  getProjects = async () => {
    const {activeOptionId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedList = fetchedData.projects.map(project =>
        this.formattedData(project),
      )
      this.setState({
        projectsList: updatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectOption = activeId => {
    this.setState({activeOptionId: activeId}, this.getProjects)
  }

  renderSelectOptionSection = () => {
    const {activeOptionId} = this.state
    const onChangeOption = event => {
      this.onChangeSelectOption(event.target.value)
    }
    return (
      <select
        className="select-container"
        onChange={onChangeOption}
        value={activeOptionId}
      >
        {categoriesList.map(eachCategory => {
          const {displayText, id} = eachCategory
          return (
            <option key={id} value={id} className="option-style">
              {displayText}
            </option>
          )
        })}
      </select>
    )
  }

  renderProjectsList = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-list-container">
        {projectsList.map(eachProject => {
          const {name, imageUrl, id} = eachProject
          return (
            <li key={id} className="project-item">
              <img src={imageUrl} className="project-pic" alt={name} />
              <p className="name">{name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="TailSpin" color="#3dd4f2" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.onClickRetry}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderProjectsBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="projects-container">
        <Header />
        <div className="responsive-container">
          {this.renderSelectOptionSection()}
          {this.renderProjectsBasedOnApiStatus()}
        </div>
      </div>
    )
  }
}

export default Projects
