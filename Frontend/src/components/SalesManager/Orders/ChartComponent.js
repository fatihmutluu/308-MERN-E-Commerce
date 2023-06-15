import React, { useState, useEffect } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  LineElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,  
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { fetchOrderStats } from '../../../redux/slices/orders/ordersSlices';
import { useDispatch, useSelector } from 'react-redux';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from '@emotion/styled';

ChartJS.register(
  LineElement, 
  CategoryScale,
  LinearScale,
  PointElement, 
  Legend,
  Tooltip,  
); 
ChartJS.register(zoomPlugin); 

const ChartComponent = () => {
  
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      dispatch(
        fetchOrderStats({
          startDate,
          endDate
        })
      );
    }
  }, [dispatch, startDate, endDate]);

  
  const chartClickHandler = () => {
    dispatch(
      fetchOrderStats({
        startDate,
        endDate,
      })
    );
    setDisplay(true);
  };
  
  const { loading, stats } = useSelector((state) => state?.orders);

  const chartOptions = {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Date'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    },

    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          enabled: true,
          mode: 'x',
          speed: 0.1,
        },
      }},
    zoom: {  
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'x',
      }
    }
  };

  return (
    <Wrapper>
      <Card>
        <Divider>
          <Label>Start Date</Label> 
          <DatePicker 
            selected={startDate} 
            onChange={(date) => setStartDate(date)}  
            dateFormat="yyyy-MM-dd"
            placeholderText="Please select a date"
          />
        </Divider>

        <Divider>  
          <Label>End Date</Label>
          <DatePicker
            selected={endDate}  
            onChange={(date) => setEndDate(date)}    
            dateFormat="yyyy-MM-dd" 
            placeholderText="Please select a date"
          />
        </Divider>
        
        <Button onClick={() => chartClickHandler()}>Draw Chart</Button>
        {display && (loading ? <LoadingComponent /> 
        : <Line 
          style={{height: "100px", width: "100px", marginTop: "20px"}} 
          data={stats?.chartData} 
          options={chartOptions}/>)}
      </Card>
    </Wrapper>
  );
};

// Styled components...


const Wrapper = styled.div`
  margin: 3rem; 
`;

const Card = styled.div`
  background: #fff;
  padding: 3rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
`;

const Divider = styled.div`
  display: flex; 
  margin-bottom: 2rem; 
  border-bottom: 1px solid #e5e5e5;
`;

const Label = styled.div`
  color: #555; 
  margin-right: 1rem;
`;

const Button = styled.button`
  background: #007bff;
  color: #fff;
  padding: 1rem;
  border-radius: 0.25rem; 
`;

export default ChartComponent;