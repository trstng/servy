'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    service_type: '',
    city: '',
    state: '',
    description: '',
    price_range: '$',
    is_licensed: false,
    is_insured: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('vendors').insert([
        {
          ...formData,
          rating: 5.0,
          review_count: 0,
          image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        },
      ])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        setFormData({
          name: '',
          service_type: '',
          city: '',
          state: '',
          description: '',
          price_range: '$',
          is_licensed: false,
          is_insured: false,
        })
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create vendor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-led-purple-dark opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-led-blue-dark opacity-20 blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold mb-2 bg-gradient-to-r from-led-blue via-led-purple to-led-purple-dark bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Servy
          </motion.h1>
          <p className="text-gray-400">Join the future of home services</p>
        </div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="frosted-glass rounded-[24px] p-8 led-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Vendor Signup
          </h2>

          {/* Business Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Business Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 focus:border-led-blue focus:ring-2 focus:ring-led-blue/20 outline-none transition-all"
              placeholder="Crystal Clear Services"
            />
          </div>

          {/* Service Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Service Type
            </label>
            <select
              required
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="w-full px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 focus:border-led-purple focus:ring-2 focus:ring-led-purple/20 outline-none transition-all"
            >
              <option value="">Select a service</option>
              <option value="Power Washing">Power Washing</option>
              <option value="Window Cleaning">Window Cleaning</option>
              <option value="Lawn Care">Lawn Care</option>
              <option value="Pool Cleaning">Pool Cleaning</option>
              <option value="Gutter Cleaning">Gutter Cleaning</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 focus:border-led-blue focus:ring-2 focus:ring-led-blue/20 outline-none transition-all"
                placeholder="Austin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                State
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 focus:border-led-purple focus:ring-2 focus:ring-led-purple/20 outline-none transition-all"
                placeholder="TX"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-[16px] bg-white/5 border border-white/10 focus:border-led-blue focus:ring-2 focus:ring-led-blue/20 outline-none transition-all resize-none"
              placeholder="Tell us about your business..."
            />
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Price Range
            </label>
            <div className="flex gap-3">
              {['$', '$$', '$$$'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setFormData({ ...formData, price_range: range })}
                  className={`flex-1 py-3 rounded-[16px] border transition-all ${
                    formData.price_range === range
                      ? 'bg-led-blue border-led-blue text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-led-blue/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mb-8 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_licensed}
                onChange={(e) => setFormData({ ...formData, is_licensed: e.target.checked })}
                className="w-5 h-5 rounded-[8px] border-2 border-white/10 bg-white/5 checked:bg-led-blue checked:border-led-blue transition-all"
              />
              <span className="text-gray-300 group-hover:text-white transition-colors">
                Licensed
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.is_insured}
                onChange={(e) => setFormData({ ...formData, is_insured: e.target.checked })}
                className="w-5 h-5 rounded-[8px] border-2 border-white/10 bg-white/5 checked:bg-led-purple checked:border-led-purple transition-all"
              />
              <span className="text-gray-300 group-hover:text-white transition-colors">
                Insured & Bonded
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-[20px] font-semibold text-white transition-all ${
              success
                ? 'bg-green-500'
                : 'bg-gradient-to-r from-led-blue-dark to-led-purple-dark hover:shadow-lg hover:shadow-led-purple/50'
            }`}
            whileHover={{ scale: success ? 1 : 1.02 }}
            whileTap={{ scale: success ? 1 : 0.98 }}
          >
            {loading ? 'Creating...' : success ? '✓ Vendor Created!' : 'Join Servy'}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <a href="#" className="text-led-blue hover:text-led-blue-light transition-colors">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  )
}
