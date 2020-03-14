<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_products extends CI_Model{
	
	protected $table = 'boardfy_products';
	
	public function insert($data) {
        if ($this->exist($data['date'], $data['mc'], $data['ean'])) {
            return 0;
        } else {
            $this->db->insert($this->table, $data);
            $result = $this->db->insert_id();
    
            if ($result) {
                return $result;
            } else {
                return 0;
            }
        }
    }

    function exist($date, $mc, $ean){       
        $sql = "SELECT * FROM boardfy_products WHERE DATE='".$date."' AND mc='".$mc."' AND ean='".$ean."'";
        $query = $this->db->query($sql);
        $count = $query->num_rows();
      
        return ($count > 0) ? TRUE : FALSE;
    }

    public function getTodayData($date, $mc) {
        $this->db->from($this->table);
        $this->db->where('date', $date)->where('mc', $mc);
        return $this->db->get()->result();
    }

    public function checkAvaialble($ean, $date) {
        return $this->db->from($this->table)->where('date', $date)->get()->result();
    }
	
}