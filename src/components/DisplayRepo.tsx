import {Avatar, Box, Card, CardActionArea, Container, Fade, Typography} from "@mui/material"
import styles from "./RepoCard.module.css";

import { TransitionGroup } from "react-transition-group";

import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';

import {filterRepoData, useRepo} from "./Utils";
import React from "react";
import {Repository} from "../types";

import {useMediaQuery} from "react-responsive";

export default function DisplayRepos({profileName}: { profileName: string }) {
    const {repos, isLoading, isError} = useRepo(profileName);
    const isMobile = useMediaQuery({ minWidth: 767});


    if (isLoading) return <></>;
    if (isError) return <></>;

    // Filters through repositories by Stargazers then picks the top4
    let top4 = filterRepoData(repos).slice(-4);
    top4 = top4.reverse();


    return (<TransitionGroup>
        {top4.map(repo => {
            return RepoCard(repo, isMobile)
        })}
    </TransitionGroup>);
}


function RepoCard(repo: Repository, isMobile: boolean) {
    const date = new Date(repo.created_at);

    return (
        <Fade key={repo.id}>
            <Card className={styles.card} sx={{m: 2, maxWidth: 500}}>
                <CardActionArea href={repo.html_url} style={{display: "flex", padding: "10xp", flexDirection: isMobile ?  "row" : "column-reverse"}}
                                target="_blank">
                    <Container>
                        <Typography variant="h6">{repo.name}</Typography>
                        <Typography className={styles.profileTextInfo}>Open Issues: {repo.open_issues}</Typography>
                        <Typography className={styles.profileTextInfo}>Is
                            Licenced: {repo["license"] ? repo["license"].name : "False"}</Typography>
                        <Typography className={styles.profileTextInfo}>Created at: {date.toDateString()}</Typography>
                        <Typography className={styles.profileTextInfo}>Language used: {repo.language}</Typography>

                        <Box className={styles.secondaryContainer} sx={{mt: 1, mb: 1}}>
                            <Typography className={styles.iconStats}><StarIcon/>{repo.stargazers_count}</Typography>
                            <Typography className={styles.iconStats}><ForkRightIcon/>{repo.forks}</Typography>
                        </Box>

                    </Container>
                    <Avatar variant="rounded" alt={"Repository IMG"}
                            sx={{width: 128, height: 128, m: 2}}>{repo.name[0]}</Avatar>
                </CardActionArea>
            </Card>
        </Fade>
    );
}
