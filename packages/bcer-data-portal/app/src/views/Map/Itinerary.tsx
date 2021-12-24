import { BCDirectionData } from '@/constants/localInterfaces';
import {
  Box,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles(() => ({
  result: {
    backgroundColor: '#E0E8F0',
    padding: '5px 15px',
    borderRadius: '4px',
  },
  resultText: {
    color: '#0053A4',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  directionText: {
    maxWidth: '400px',
    padding: '5px 15px',
  },
  directionType: {
    maxWidth: '400px',
    padding: '5px 15px',
    fontWeight: 'bold',
  },
  directionWrapper: {
    marginBottom: '8px',
    backgroundColor: 'rgba(46,133,64,0.1)',
    border: '1px solid #2E8540',
    borderRadius: '4px',
  },
  notificationWrapper: {
    marginBottom: '8px',
    backgroundColor: 'rgba(30,64,255,0.2)',
    border: '1px solid #2E8540',
    borderRadius: '4px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
}));

interface ItineraryProps {
  directionData: BCDirectionData;
}

function Itinerary({ directionData }: ItineraryProps) {
  const classes = useStyles();
  const { directions = [] } = directionData ?? {};

  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState({
    prev: 0,
    next: 10,
  });

  const [current, setCurrent] = useState(
    directions.slice(count.prev, count.next)
  );
  
  const getMoreData = () => {
    if (current.length === directions.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setCurrent(
        current.concat(directions.slice(count.prev + 10, count.next + 10))
      );
    }, 1000);
    setCount((prevState) => ({
      prev: prevState.prev + 10,
      next: prevState.next + 10,
    }));
  };

  return (
    <Box mt={2}>
      {!!directions?.length && (
        <Box my={1}>
          <Typography className={classes.label}>Direction</Typography>
        </Box>
      )}
      {!!directionData && (
        <InfiniteScroll
          dataLength={current.length}
          next={getMoreData}
          hasMore={hasMore}
          loader={
            <>
              Loading... <CircularProgress size={20} />{' '}
            </>
          }
          height={500}
        >
          {current?.map((d) => {
            return (
              <Box key={d.text}>
                {d.type === 'START' && (
                  <Box className={classes.directionWrapper}>
                    <Typography className={classes.directionText}>
                      Start
                    </Typography>
                  </Box>
                )}
                {!!d.notifications?.length &&
                  d.notifications.map((n) => (
                    <Box key={n.message + d.text}>
                      <Box className={classes.notificationWrapper}>
                        <Typography className={classes.directionText}>
                          {n.type}
                        </Typography>
                      </Box>
                      <Box className={classes.notificationWrapper}>
                        <Typography className={classes.directionText}>
                          {n.message}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                <Box className={classes.directionWrapper}>
                  <Typography className={classes.directionType}>
                    {d.type}
                  </Typography>
                  <Typography className={classes.directionText}>
                    {d.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </InfiniteScroll>
      )}
    </Box>
  );
}

export default Itinerary;
