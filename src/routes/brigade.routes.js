router.delete('/brigadas/location/release', validateToken, async (req, res) => {
  const { report_id } = req.body
  if (!report_id) return res.status(400).json({ error: 'report_id required' })

  try {
    await pool.query(
      'DELETE FROM brigade_locations WHERE report_id = $1',
      [report_id]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})