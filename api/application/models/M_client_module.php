<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_client_module extends CI_Model{
	
	protected $table = 'client_module';
    
    public function __construct()
    {
        $this->load->database();
    }

    public function get_client_modules() {
        $sql = "SELECT client_module_id, client_module_client_id, client_module_marketplace_id, client_module_is_review, 
        client_module_is_content, client_module_is_price, client_module_is_answers, client_module_is_po, client_module_is_active, client_name, marketplace_code 
        FROM (SELECT * FROM client_module LEFT JOIN client ON client_module.client_module_client_id=client.client_id) AS a 
        LEFT JOIN marketplace ON a.client_module_marketplace_id=marketplace.marketplace_id";
        $result = $this->db->query($sql)->result();
		return $result;
    }

    public function get_client_names() {
        $sql = "SELECT client_id, client_name FROM client";
        $result = $this->db->query($sql)->result();
		return $result;
    }

    public function get_marketplace_codes() {
        $sql = "SELECT marketplace_id, marketplace_code FROM marketplace";
        $result = $this->db->query($sql)->result();
		return $result;
    }

	public function check_exists($client_module_client_id, $client_module_marketplace_id) {
        $this->db->select('client_module_id')->from($this->table);
        $array = array('client_module_client_id' => $client_module_client_id, 'client_module_marketplace_id' => $client_module_marketplace_id);
        $this->db->where($array);

        $result = $this->db->get()->row();

        if ($result) {
            return $result;
        } else {
            return 0;
        }
        
    }

    public function insert_clientmodule($data) {
        if ($this->check_exists($data['client_module_client_id'], $data['client_module_marketplace_id'])) {
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

    public function delete_clientmodule($id) {
        $this->db->where('client_module_id', $id);
        $result = $this->db->delete($this->table);
        return $result;
    }

    public function edit_clientmodule($id, $data) {
        $this->db->where('client_module_id', $id);
        $result = $this->db->update($this->table, $data);
        return $result;
    }
}