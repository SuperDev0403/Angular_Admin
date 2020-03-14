<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_client extends CI_Model{
	
	protected $table = 'client';
    
    public function __construct()
    {
        $this->load->database();
    }

    public function get_clients() {
        $sql = "SELECT client_id, client_name, client_cif, client.client_type_id AS client_type_id, client_type_platform, client_is_active FROM client, client_type WHERE client.client_type_id=client_type.client_type_id";
        $result = $this->db->query($sql)->result();
		return $result;
    }

    public function get_types() {
        $sql = "SELECT * FROM client_type";
        $result = $this->db->query($sql)->result();
		return $result;
    }

	public function check_name_exists($client_name) {
        $this->db->select('client_id')->from($this->table);
        $this->db->where('client_name',$client_name);

        $result = $this->db->get()->row();

        if ($result) {
            return $result;
        } else {
            return 0;
        }
        
    }

    public function insert_client($data) {
        if ($this->check_name_exists($data['client_name'])) {
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

    public function delete_client($id) {
        $this->db->where('client_id', $id);
        $result = $this->db->delete($this->table);
        return $result;
    }

    public function edit_client($id, $data) {
        $this->db->where('client_id', $id);
        $result = $this->db->update($this->table, $data);
        return $result;
    }
	
	public function get_client_modules() {
		$this->db->from($this->table);
		$result = $this->db->get()->result();
		return $result;
	}
}