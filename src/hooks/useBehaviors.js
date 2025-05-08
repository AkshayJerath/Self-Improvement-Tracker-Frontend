'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useBehaviors = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [topBehaviors, setTopBehaviors] = useState([]);
  const [currentBehavior, setCurrentBehavior] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all behaviors
  const getBehaviors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching behaviors...');
      const res = await axios.get('/behaviors');
      console.log('Behaviors response:', res.data);
      const fetchedBehaviors = res.data.data || [];
      setBehaviors(fetchedBehaviors);
      return fetchedBehaviors;
    } catch (err) {
      console.error('Error fetching behaviors:', err);
      setError(err.response?.data?.error || 'Error fetching behaviors');
      toast.error('Failed to fetch behaviors');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get top behaviors
  const getTopBehaviors = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching top behaviors...');
      const res = await axios.get('/behaviors/top');
      console.log('Top behaviors response:', res.data);
      const fetchedTopBehaviors = res.data.data || [];
      setTopBehaviors(fetchedTopBehaviors);
      return fetchedTopBehaviors;
    } catch (err) {
      console.error('Error fetching top behaviors:', err);
      setError(err.response?.data?.error || 'Error fetching top behaviors');
      toast.error('Failed to fetch top behaviors');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single behavior
  const getBehavior = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching behavior with ID: ${id}`);
      const res = await axios.get(`/behaviors/${id}`);
      console.log('Behavior response:', res.data);
      const fetchedBehavior = res.data.data;
      setCurrentBehavior(fetchedBehavior);
      return fetchedBehavior;
    } catch (err) {
      console.error(`Error fetching behavior with ID ${id}:`, err);
      setError(err.response?.data?.error || 'Error fetching behavior');
      toast.error('Failed to fetch behavior details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create behavior
  const createBehavior = async (behaviorData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating behavior with data:', behaviorData);
      const res = await axios.post('/behaviors', behaviorData);
      console.log('Create behavior response:', res.data);
      const newBehavior = res.data.data;
      setBehaviors([...behaviors, newBehavior]);
      toast.success('Behavior created successfully');
      return newBehavior;
    } catch (err) {
      console.error('Error creating behavior:', err);
      setError(err.response?.data?.error || 'Error creating behavior');
      toast.error('Failed to create behavior');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update behavior
  const updateBehavior = async (id, behaviorData) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Updating behavior with ID ${id} with data:`, behaviorData);
      const res = await axios.put(`/behaviors/${id}`, behaviorData);
      console.log('Update behavior response:', res.data);
      const updatedBehavior = res.data.data;
      
      setBehaviors(
        behaviors.map((behavior) =>
          behavior._id === id ? updatedBehavior : behavior
        )
      );
      
      if (currentBehavior && currentBehavior._id === id) {
        setCurrentBehavior(updatedBehavior);
      }
      
      toast.success('Behavior updated successfully');
      return updatedBehavior;
    } catch (err) {
      console.error(`Error updating behavior with ID ${id}:`, err);
      setError(err.response?.data?.error || 'Error updating behavior');
      toast.error('Failed to update behavior');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete behavior
  const deleteBehavior = async (id) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Deleting behavior with ID: ${id}`);
      await axios.delete(`/behaviors/${id}`);
      console.log('Behavior deleted successfully');
      
      setBehaviors(behaviors.filter((behavior) => behavior._id !== id));
      
      if (currentBehavior && currentBehavior._id === id) {
        setCurrentBehavior(null);
      }
      
      toast.success('Behavior deleted successfully');
      return true;
    } catch (err) {
      console.error(`Error deleting behavior with ID ${id}:`, err);
      setError(err.response?.data?.error || 'Error deleting behavior');
      toast.error('Failed to delete behavior');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    behaviors,
    topBehaviors,
    currentBehavior,
    loading,
    error,
    getBehaviors,
    getTopBehaviors,
    getBehavior,
    createBehavior,
    updateBehavior,
    deleteBehavior,
  };
};