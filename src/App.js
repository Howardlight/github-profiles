import { useState } from 'react';
import './App.css';

//Material UI
import {
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Paper,
} from "@mui/material";

function App() {

  const [profile, setProfile] = useState("null");
  const [searchQuery, setSearchQuery] = useState("defunkt");
  const [userExists, setUserExists] = useState(true); 
  const [repos, setRepos] = useState(null);
  //TODO: modify this to be three states,
  // exists does, not exist and onMount(nothing displays)


  // helper Func, used in getProfileData 
  function handleErrors(response) {
    if(!response.ok) {
      setUserExists(false);
      throw Error(response.statusText);
    }
    return response;
  }

  function getProfileData(key) {
    const baseUrl = "https://api.github.com/users/";
    fetch(`${baseUrl}${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(handleErrors)
    .then(response => {return response.json()})
    .then(data => {
      // console.log(data);
      setUserExists(true);
      setProfile(data);
    })
    .catch(err => console.log(err)) // It should not reach this point, handle errors will catch it
  }

  async function getRepoData(key) {
    const baseUrl = "https://api.github.com/users/";
    fetch(`${baseUrl}${key}/repos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(handleErrors)
    .then(response => {return response.json()})
    .then(data => {
      // console.log(data);


      // return filterRepoData(data);
      data = filterRepoData(data);
      setRepos(data);
      // console.log(repos);
      // setUserExists(true);
      // setProfile(data);
    })
    .catch(err => console.log(err)) // It should not reach this point, handle errors will catch it
  }
  // Sorts Array  by stargazers_count ascending
  function filterRepoData(obj) {

    // const duplicateElement = toFindDuplicates(obj);
    // console.log(duplicateElement);

    let temp = null;
    for(let i = 0; i < obj.length; i++){
      for(let j = i+1; j < obj.length; j++){
        // if(obj[j] === undefined) continue;
        
        if(obj[j].stargazers_count < obj[i].stargazers_count){
          temp = obj[i];
          obj[i] = obj[j];
          obj[j] = temp;
        }
      }
    }
    return obj;
  }

  // FORM FUNCTIONS
  const handleOnSubmit = (event) => {
    event.preventDefault();
    getProfileData(searchQuery);
  }
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const Hero = () => {
    return(
      <Typography variant="h4" component="h1" gutterBottom>
        Github Profiles
      </Typography>
    );
  }

  const Footer = () => {
    return(
      <Typography variant="body2" color="text.secondary" align="center">
        Created by <a href="https://github.com/Howardlight" style={{textDecoration: "none"}}>HowardLight</a>, 2022
      </Typography>
    );
  }

  const DisplayProfile = () => {
    return(
      <div className='ProfileCard'>
        <Container style={{marginTop: "20px", marginBottom: "20px"}}>
          <Paper elevation={10} style={{padding: "20px", paddingLeft:"10px", paddingRight: "10px", display:"flex"}}>
            <Container>
              <Typography>Login Name: {profile.login}</Typography>
              <Typography>Name: {profile.name}</Typography>
              <Typography>Created at: {profile.created_at}</Typography>
              <Typography>Followers: {profile.followers}</Typography>
              <Typography>Repo count: {profile.public_repos}</Typography>
            </Container>
            <Avatar src={profile.avatar_url} variant="rounded" alt={"Profile IMG"} sx={{ width: 128, height: 128}}/>
          </Paper>
        </Container>
      </div>
    );  
  }

  const DisplayRepos = ({repos}) => {
    let top4 = repos.slice(-4);
    console.log(top4);

    return(<div> {top4.map(repo => {return repoCard(repo)})}</div>);
  }

  // TODO improve this
  const Display404 = () => {
    return(
      <div className='ProfileCard'>
        <Container style={{marginTop: "20px", marginBottom: "20px"}}>
          <Paper elevation={10} style={{padding: "20px", paddingLeft:"20px", paddingRight: "20px", display:"flex"}}>
            <Container style={{padding: "30px"}}>
              <Typography variant="h5" style={{display: "inline-flex", alignItems: "center"}}><WarningIcon fontSize="large" color="warning"/>404: User not found</Typography>
            </Container>
          </Paper>
        </Container>
      </div>
    );
  }

  function repoCard(repo) {
    // console.log(repo["license"]);
    //TODO: Center SVGs (Icons)
    const date = new Date(repo.created_at);
    return(
      <CardActionArea key={repo.id} href={repo.html_url} target="_blank">
        <Card style={{padding: "30px", marginTop: "10px", marginBottom:"10px", display:"flex"}}>
          <Container style={{display: "flex", flexDirection: "column", justifyContent:"flex-start"}}>
            <Typography variant="h6">{repo.name}</Typography>
            <Typography style={{display: "flex", alignItems: "center"}}>Open Issues: {repo.open_issues}</Typography>
            <Typography style={{display: "flex", alignItems: "center"}}>Is Licenced: {repo["license"] ? repo["license"].name : "False"}</Typography>
            <Typography style={{display: "flex", alignItems: "center"}}>Created at: {date.toDateString()}</Typography>
            <Typography style={{display: "flex", alignItems: "center"}}>Language used: {repo.language}</Typography>

            <Container style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", paddingLeft: "0px", marginTop: "30px"}}>
              <Typography style={{marginRight: "10px", display: "inline-flex", alignItems: "center"}}><StarIcon />{repo.stargazers_count}</Typography>
              <Typography style={{marginRight: "10px", display: "inline-flex", alignItems: "center"}}><ForkRightIcon />{repo.forks}</Typography>
            </Container>
          </Container>
          <Avatar variant="rounded" alt={"Profile IMG"} sx={{ width: 128, height: 128}}>{repo.name[0]}</Avatar>
        </Card>
      </CardActionArea>
    );
  }


  //TODO: create a good layout, maybe use a framework like bootstrap
  //TODO: Add animations
  //TODO: Create func that will get top 4 repos, use https://api.github.com/users/Howardlight/repos
  //TODO: Turn the 404 into a Component, use Material UI
  //TODO: add light mode/ dark mode
  return (
    <Container className="App" maxWidth="sm">
      <Hero />



        <div className='Form' style={{margin: "1em", display: "flex", justifyContent: "center"}}>
          <form onSubmit={handleOnSubmit}>
            <TextField color="primary" variant="outlined" label="Github Profile" type='text' onChange={handleQueryChange}/>
            <Button style={{minHeight: "55px", marginLeft: "10px"}} size="large" variant="contained" type='submit'>Search</Button>
          </form>
        </div>


        {userExists ? <DisplayProfile /> : "404: USER NOT FOUND"}


        <Footer />

      </Container>
  );
}

export default App;
