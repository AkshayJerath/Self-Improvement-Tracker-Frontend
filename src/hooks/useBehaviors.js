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
      const res = await axios.get('/behaviors');
      setBehaviors(res.data.data);
      return res.data.data;
    } catch (err) {
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
      const res = await axios.get('/behaviors/top');
      setTopBehaviors(res.data.data);
      return res.data.data;
    } catch (err) {
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
      const res = await axios.get(`/behaviors/${id}`);
      setCurrentBehavior(res.data.data);
      return res.data.data;
    } catch (err) {
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
      const res = await axios.post('/behaviors', behaviorData);
      setBehaviors([...behaviors, res.data.data]);
      toast.success('Behavior created successfully');
      return res.data.data;
    } catch (err) {
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
      const res = await axios.put(`/behaviors/${id}`, behaviorData);
      setBehaviors(
        behaviors.map((behavior) =>
          behavior._id === id ? res.data.data : behavior
        )
      );
      if (currentBehavior && currentBehavior._id === id) {
        setCurrentBehavior(res.data.data);
      }
      toast.success('Behavior updated successfully');
      return res.data.data;
    } catch (err) {
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
      await axios.delete(`/behaviors/${id}`);
      setBehaviors(behaviors.filter((behavior) => behavior._id !== id));
      if (currentBehavior && currentBehavior._id === id) {
        setCurrentBehavior(null);
      }
      toast.success('Behavior deleted successfully');
      return true;
    } catch (err) {
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