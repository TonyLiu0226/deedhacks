import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

interface JobCardProps {
    url: string;
    job_title: string;
    description: string;
    locations: string[];
    company_name: string;
    publish_date: string;

}

export default function JobCard({url, job_title, description, locations, company_name, publish_date}: JobCardProps) {
  return (
    <Card sx={{ minWidth: 275, maxHeight: 500, overflowY: 'scroll', marginTop: 5 }}>
      <CardContent>
        <Typography sx={{ fontSize: 36, marginTop: "5px", marginBottom: "3px"}} color="text.secondary" gutterBottom>
          {job_title}
        </Typography>
        <Typography variant="h5" sx={{ fontSize: 18 }} component="div">
          {company_name}
        </Typography>
        <Typography sx={{ mb: 1.5}} color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2">
          locations: {locations[0]}.
        </Typography>
        <Typography variant="body2">
          Published on: {publish_date}.
        </Typography>
      </CardContent>
      <CardActions >
          <a href={url}>Apply</a>
      </CardActions>
    </Card>
  );
}